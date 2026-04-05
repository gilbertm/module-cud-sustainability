<?php

namespace Drupal\cud_sustainability\Controller;

use Drupal\Core\Cache\Cache;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Entity\EntityFieldManagerInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Logger\LoggerChannelInterface;
use Drupal\Core\Logger\LoggerChannelFactoryInterface;
use Drupal\Core\Menu\MenuLinkTreeInterface;
use Drupal\Core\Menu\MenuTreeParameters;
use Drupal\Core\Url;
use Drupal\node\NodeInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Handles CUD sustainability routes under /sustainability.
 */
class SustainabilityController extends ControllerBase {

  /**
   * Sustainability content type machine name.
   */
  protected const RESEARCH_BUNDLE = 'sustainability';

  /**
   * Slug field machine name.
   */
  protected const RESEARCH_SLUG_FIELD = 'field_research_slug';

  /**
   * Node storage instance.
   *
   * @var \Drupal\Core\Entity\EntityStorageInterface
   */
  protected $nodeStorage;

  /**
   * View builder for node entities.
   *
   * @var \Drupal\Core\Entity\EntityViewBuilderInterface
   */
  protected $nodeViewBuilder;

  /**
   * View builder for media entities.
   *
   * @var \Drupal\Core\Entity\EntityViewBuilderInterface
   */
  protected $mediaViewBuilder;

  /**
   * Current request stack.
   *
   * @var \Symfony\Component\HttpFoundation\RequestStack
   */
  protected $requestStack;

  /**
   * Menu link tree service.
   *
   * @var \Drupal\Core\Menu\MenuLinkTreeInterface
   */
  protected $menuLinkTree;

  /**
   * Entity field manager service.
   *
   * @var \Drupal\Core\Entity\EntityFieldManagerInterface
   */
  protected $entityFieldManager;

  /**
   * Logger channel.
   *
   * @var \Drupal\Core\Logger\LoggerChannelInterface
   */
  protected $logger;

  /**
   * Constructs a SustainabilityController object.
   */
  public function __construct(EntityTypeManagerInterface $entity_type_manager, EntityFieldManagerInterface $entity_field_manager, RequestStack $request_stack, MenuLinkTreeInterface $menu_link_tree, LoggerChannelFactoryInterface $logger_factory) {
    $this->nodeStorage = $entity_type_manager->getStorage('node');
    $this->nodeViewBuilder = $entity_type_manager->getViewBuilder('node');
    $this->mediaViewBuilder = $entity_type_manager->getViewBuilder('media');
    $this->entityFieldManager = $entity_field_manager;
    $this->requestStack = $request_stack;
    $this->menuLinkTree = $menu_link_tree;
    $this->logger = $logger_factory->get('cud_sustainability');
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('entity_type.manager'),
      $container->get('entity_field.manager'),
      $container->get('request_stack'),
      $container->get('menu.link_tree'),
      $container->get('logger.factory')
    );
  }

  /**
   * Landing page for /sustainability.
   */
  public function index(): array {
    $request = $this->requestStack->getCurrentRequest();

    $this->trace('index() called', [
      '@path' => $request ? $request->getPathInfo() : '/',
    ]);

    $main_node = $this->loadPublishedNodeBySlug('main');
    if ($main_node) {
      $this->trace('Main node loaded', [
        '@nid' => (string) $main_node->id(),
        '@title' => $main_node->label(),
      ]);

      $build = $this->buildPage(
        $main_node->label(),
        $this->nodeViewBuilder->view($main_node, 'full'),
        'main',
        $this->getCarouselItems($main_node),
        $this->getSections($main_node),
        $this->getMenuItems('cud-sustainability-primary'),
        $this->getMenuItems('cud-sustainability-secondary')
      );
      $build['#cache']['tags'] = $main_node->getCacheTags();

      return $build;
    }

    $this->trace('Main node not found, returning fallback overview page');

    return $this->buildPage(
      $this->t('Sustainability Overview')->render(),
      [
        '#markup' => $this->t('Welcome to the Sustainability Hub.'),
      ],
      'main',
      [],
      [],
      $this->getMenuItems('cud-sustainability-primary'),
      $this->getMenuItems('cud-sustainability-secondary')
    );
  }

  /**
   * Displays sustainability-only search results.
   */
  public function search(): array {
    $request = $this->requestStack->getCurrentRequest();
    $query = trim((string) ($request ? $request->query->get('q', '') : ''));
    $results = $this->searchResearchNodes($query);

    $build = $this->buildPage(
      $this->t('Sustainability Search')->render(),
      $this->buildSearchResultsContent($query, $results),
      'normal',
      [],
      [],
      $this->getMenuItems('cud-sustainability-primary'),
      $this->getMenuItems('cud-sustainability-secondary')
    );

    $cache_tags = ['node_list'];
    foreach ($results as $node) {
      $cache_tags = Cache::mergeTags($cache_tags, $node->getCacheTags());
    }

    $build['#cache']['contexts'][] = 'url.query_args:q';
    $build['#cache']['tags'] = $cache_tags;

    return $build;
  }

  /**
   * Renders any sustainability sub-page from the URL slug.
   *
   * Template selection is purely path-based (Drupal native convention):
   *   /sustainability                        → cud-sustainability--main.html.twig
   *   /sustainability/our-commitment/governance → cud-sustainability--our-commitment--governance.html.twig
   *                                              falling back to cud-sustainability--normal.html.twig
   *   /sustainability/*                     → cud-sustainability--normal.html.twig
   *
   * Node content is still loaded via the slug field (separate concern).
   */
  public function renderPage(string $slug) {
    $slug = trim($slug, '/');

    $this->trace('renderPage() called', ['@slug' => $slug]);

    $node = $this->loadNodeForRouteSlug($slug);

    // Template variant is derived from the URL path, not the slug field.
    $variant = $this->resolveVariantFromPath();

    $this->trace('renderPage() variant resolved', [
      '@slug' => $slug,
      '@variant' => $variant,
      '@nid' => $node ? (string) $node->id() : 'none',
    ]);

    if (!$node) {
      return $this->buildPage(
        $this->t('Sustainability')->render(),
        ['#markup' => ''],
        $variant,
        [],
        [],
        $this->getMenuItems('cud-sustainability-primary'),
        $this->getMenuItems('cud-sustainability-secondary')
      );
    }

    $build = $this->buildPage(
      $node->label(),
      $this->nodeViewBuilder->view($node, 'full'),
      $variant,
      $this->getCarouselItems($node),
      $this->getSections($node),
      $this->getMenuItems('cud-sustainability-primary'),
      $this->getMenuItems('cud-sustainability-secondary')
    );
    $build['#cache']['tags'] = $node->getCacheTags();

    return $build;
  }

  /**
   * Loads a published sustainability node by trying multiple slug permutations.
   *
   * The field_research_slug may be stored with various prefixes
   * (e.g. 'sustainability/our-commitment/governance' or
   * 'sample/sustainability/our-commitment/governance'). We try the most
   * specific variants first so the node is found regardless of how the editor
   * stored the value.
   */
  protected function loadNodeForRouteSlug(string $routeSlug): ?NodeInterface {
    $routeSlug = trim($routeSlug, '/');

    // Candidates ordered from most-specific to least-specific.
    $candidates = array_unique(array_filter([
      $routeSlug,
      'sustainability/' . $routeSlug,
      'sample/sustainability/' . $routeSlug,
      // Last segment only (e.g. 'governance' from 'our-commitment/governance').
      basename($routeSlug),
    ]));

    foreach ($candidates as $slug) {
      $node = $this->loadPublishedNodeBySlug($slug);
      if ($node) {
        $this->trace('loadNodeForRouteSlug() matched', [
          '@route_slug' => $routeSlug,
          '@matched_slug' => $slug,
          '@nid' => (string) $node->id(),
        ]);
        return $node;
      }
    }

    $this->trace('loadNodeForRouteSlug() no match', ['@route_slug' => $routeSlug]);
    return NULL;
  }

  /**
   * Resolves the template variant string from the URL slug and node state.
   *
   * Rules:
   * - No matching node (or its slug field is empty) → 'normal'
   * - URL slug 'main' (index page slug) → 'main'
   * Otherwise the sub-path becomes the variant string, with '/' → '--'.
   *
   * Template convention (mirrors Drupal's page suggestion system):
   *   path /sustainability                        → variant 'main'
   *   path /sustainability/our-commitment/governance → variant 'our-commitment--governance'
   *   path /sustainability/anything               → variant 'anything'
   * variantToThemeHook() then checks the registry and falls back to 'normal'.
   */
  protected function resolveVariantFromPath(): string {
    $request = $this->requestStack->getCurrentRequest();
    $path = $request ? trim($request->getPathInfo(), '/') : 'sustainability';

    if ($path === 'sustainability') {
      return 'main';
    }

    if (strpos($path, 'sustainability/') === 0) {
      $sub = substr($path, strlen('sustainability/'));
      // Each path segment → separated by '--' in the variant string.
      return str_replace('/', '--', $sub);
    }

    return 'normal';
  }

  /**
   * Loads a published sustainability node by configured slug value.
   */
  protected function loadPublishedNodeBySlug(string $slug) {
    $this->trace('Loading published node by slug', ['@slug' => $slug]);

    $nodes = $this->nodeStorage->loadByProperties([
      'type' => static::RESEARCH_BUNDLE,
      static::RESEARCH_SLUG_FIELD => trim($slug),
      'status' => 1,
    ]);

    $candidates = array_values($nodes);
    $node = $this->selectBestNodeCandidate($candidates);

    $this->trace('Node lookup result', [
      '@slug' => $slug,
      '@count' => (string) count($nodes),
      '@found' => $node ? 'yes' : 'no',
    ]);

    return $node ?: NULL;
  }

  /**
   * Selects best node candidate when a slug returns multiple published nodes.
   *
   * Preference order:
   * - Node with non-empty carousel images field.
   * - Higher nid (newer content in most setups).
   */
  protected function selectBestNodeCandidate(array $candidates) {
    if (empty($candidates)) {
      return NULL;
    }

    usort($candidates, function (NodeInterface $a, NodeInterface $b): int {
      $a_count = ($a->hasField('field_research_carousel_images') && !$a->get('field_research_carousel_images')->isEmpty())
        ? $a->get('field_research_carousel_images')->count()
        : 0;
      $b_count = ($b->hasField('field_research_carousel_images') && !$b->get('field_research_carousel_images')->isEmpty())
        ? $b->get('field_research_carousel_images')->count()
        : 0;

      if ($a_count !== $b_count) {
        return $b_count <=> $a_count;
      }

      return ((int) $b->id()) <=> ((int) $a->id());
    });

    $selected = $candidates[0] ?? NULL;
    if ($selected) {
      $selected_count = ($selected->hasField('field_research_carousel_images') && !$selected->get('field_research_carousel_images')->isEmpty())
        ? $selected->get('field_research_carousel_images')->count()
        : 0;
      $this->trace('Selected best slug candidate', [
        '@nid' => (string) $selected->id(),
        '@title' => $selected->label(),
        '@carousel_count' => (string) $selected_count,
      ]);
    }

    return $selected;
  }

  /**
   * Extracts carousel slides from a node's carousel fields.
   *
   * Pairs field_research_carousel_images and field_research_carousel_content
   * by delta index, returning a structured array for Twig consumption.
   *
  * @return list<array{image: array|null, image_url: string, overlay: array|null}>
   */
  public function getCarouselItems(NodeInterface $node): array {
    $this->trace('Building carousel items', [
      '@nid' => (string) $node->id(),
      '@has_images_field' => $node->hasField('field_research_carousel_images') ? 'yes' : 'no',
    ]);

    if (!$node->hasField('field_research_carousel_images')
      || $node->get('field_research_carousel_images')->isEmpty()) {
      $this->trace('Carousel image field missing/empty, using node-content fallback', [
        '@nid' => (string) $node->id(),
      ]);
      return $this->getFallbackCarouselItemsFromNode($node);
    }

    $items = [];
    $images = [];
    foreach ($node->get('field_research_carousel_images') as $image_item) {
      if (!empty($image_item->entity)) {
        $images[] = $image_item->entity;
      }
    }
    $overlays = $node->hasField('field_research_carousel_content') ? $node->get('field_research_carousel_content') : NULL;

    $this->trace('Carousel source fields detected', [
      '@nid' => (string) $node->id(),
      '@images_count' => (string) count($images),
      '@has_overlay_field' => $node->hasField('field_research_carousel_content') ? 'yes' : 'no',
    ]);

    foreach ($images as $delta => $media) {
      $overlay_item = $overlays ? $overlays->get($delta) : NULL;
      $overlay = NULL;

      if ($overlay_item) {
        $overlay_text = trim((string) ($overlay_item->value ?? ''));
        if ($overlay_text !== '') {
          $overlay_format = (string) ($overlay_item->format ?? '');
          if ($overlay_format !== '') {
            $overlay = [
              '#type' => 'processed_text',
              '#text' => $overlay_text,
              '#format' => $overlay_format,
            ];
          }
        }
      }

      $items[] = [
        'image' => $this->mediaViewBuilder->view($media, 'default'),
        'image_url' => $this->extractCarouselImageUrl($media),
        'overlay' => $overlay,
      ];

      $this->trace('Carousel item built', [
        '@nid' => (string) $node->id(),
        '@delta' => (string) $delta,
        '@media_label' => (string) $media->label(),
        '@has_overlay' => $overlay ? 'yes' : 'no',
      ]);
    }

    $this->trace('Carousel items complete', [
      '@nid' => (string) $node->id(),
      '@count' => (string) count($items),
    ]);

    return $items;
  }

  /**
   * Builds fallback carousel items from available node content.
   *
   * This keeps the carousel populated even when dedicated carousel fields are
   * not configured in the current content type setup.
   *
   * @return list<array{image: array|null, image_url: string, overlay: array|null}>
   */
  protected function getFallbackCarouselItemsFromNode(NodeInterface $node): array {
    $fallback = [[
      'image' => NULL,
      'image_url' => 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1800&q=80',
      'overlay' => NULL,
    ]];

    $this->trace('Fallback carousel item generated', [
      '@nid' => (string) $node->id(),
      '@has_overlay' => 'no',
    ]);

    return $fallback;
  }

  /**
   * Builds an absolute image URL from a carousel media entity.
   */
  protected function extractCarouselImageUrl($media): string {
    foreach (['field_media_image', 'field_image'] as $field_name) {
      if (!$media->hasField($field_name) || $media->get($field_name)->isEmpty()) {
        continue;
      }

      $file = $media->get($field_name)->entity;
      if ($file && method_exists($file, 'getFileUri')) {
        $file_uri = $file->getFileUri();
        $url = '';
        $wrapper = \Drupal::service('stream_wrapper_manager')->getViaUri($file_uri);
        if ($wrapper && method_exists($wrapper, 'getExternalUrl')) {
          $url = (string) $wrapper->getExternalUrl();
          if ($url !== '' && strpos($url, 'http://') !== 0 && strpos($url, 'https://') !== 0) {
            $request = $this->requestStack->getCurrentRequest();
            if ($request) {
              $url = $request->getSchemeAndHttpHost() . $url;
            }
          }
        }
        $this->trace('Resolved media image URL', [
          '@media_label' => (string) $media->label(),
          '@field' => $field_name,
        ]);
        return $url;
      }
    }

    $this->trace('No image URL resolved for media entity', [
      '@media_label' => (string) $media->label(),
    ]);

    return '';
  }

  /**
   * Toggle trace logs with ?trace=1 or ?debug=1.
   */
  protected function isTraceEnabled() {
    $request = $this->requestStack->getCurrentRequest();
    if (!$request) {
      return FALSE;
    }

    $raw = (string) ($request->query->get('trace', $request->query->get('debug', '0')));

    return in_array(strtolower(trim($raw)), ['1', 'true', 'yes', 'on'], TRUE);
  }

  /**
   * Writes module trace logs to Drupal logger when enabled.
   */
  protected function trace(string $message, array $context = []) {
    if (!$this->isTraceEnabled()) {
      return;
    }

    $this->logger->notice('[trace] ' . $message, $context);
  }

  /**
   * Extracts ordered sections from field_research_sections as processed HTML.
   *
   * @return list<array>
   */
  protected function getSections(NodeInterface $node): array {
    if (!$node->hasField('field_research_sections')
      || $node->get('field_research_sections')->isEmpty()) {
      return [];
    }

    $sections = [];
    foreach ($node->get('field_research_sections') as $item) {
      if (!$item->isEmpty()) {
        $sections[] = [
          '#type' => 'processed_text',
          '#text' => $item->value,
          '#format' => $item->format ?? 'full_html',
        ];
      }
    }

    return $sections;
  }

  /**
   * Loads enabled items for a named Drupal menu with one child level.
   *
   * @return list<array{title: string, url: string, active: bool, children: list<array{title: string, url: string, active: bool}>}>
   */
  protected function getMenuItems(string $menu_name): array {
    $parameters = new MenuTreeParameters();
    $parameters->setMaxDepth(2)->onlyEnabledLinks();
    $tree = $this->menuLinkTree->load($menu_name, $parameters);

    $manipulators = [
      ['callable' => 'menu.default_tree_manipulators:checkAccess'],
      ['callable' => 'menu.default_tree_manipulators:generateIndexAndSort'],
    ];
    $tree = $this->menuLinkTree->transform($tree, $manipulators);

    $request = $this->requestStack->getCurrentRequest();
    $current_path = $request ? $request->getPathInfo() : '/';
    $items = [];

    foreach ($tree as $element) {
      $parent = $this->normalizeMenuElement($element, $current_path);
      if (!$parent) {
        continue;
      }

      $items[] = $parent;
    }

    return $items;
  }

  /**
   * Normalizes a menu element for Twig rendering.
   *
   * @param object $element
   *   Menu tree element.
   * @param string $current_path
   *   Current request path for active-link checks.
   *
   * @return array|null
   *   Normalized item with optional children, or NULL if inaccessible.
   */
  protected function normalizeMenuElement($element, string $current_path) {
    if (!($element->access && $element->access->isAllowed())) {
      return NULL;
    }

    $url = $element->link->getUrlObject()->toString();
    $children = [];

    foreach ($element->subtree as $child) {
      $child_item = $this->normalizeMenuElement($child, $current_path);
      if ($child_item) {
        $children[] = [
          'title' => $child_item['title'],
          'url' => $child_item['url'],
          'active' => $child_item['active'],
        ];
      }
    }

    $is_active = rtrim($url, '/') === rtrim($current_path, '/');
    if (!$is_active && $children) {
      foreach ($children as $child) {
        if (!empty($child['active'])) {
          $is_active = TRUE;
          break;
        }
      }
    }

    return [
      'title' => $element->link->getTitle(),
      'url' => $url,
      'active' => $is_active,
      'children' => $children,
    ];
  }

  /**
   * Returns published sustainability nodes matching a free-text query.
   *
   * @return list<\Drupal\node\NodeInterface>
   *   Matching sustainability nodes.
   */
  protected function searchResearchNodes(string $query): array {
    $query = trim($query);
    if ($query == '') {
      return [];
    }

    $field_definitions = $this->entityFieldManager->getFieldDefinitions('node', static::RESEARCH_BUNDLE);
    $pattern = '%' . \Drupal::database()->escapeLike($query) . '%';

    $entity_query = \Drupal::entityQuery('node')
      ->condition('type', static::RESEARCH_BUNDLE)
      ->condition('status', 1);
    if (method_exists($entity_query, 'accessCheck')) {
      $entity_query->accessCheck(TRUE);
    }

    $or = $entity_query->orConditionGroup()
      ->condition('title', $pattern, 'LIKE');

    if (isset($field_definitions[static::RESEARCH_SLUG_FIELD])) {
      $or->condition(static::RESEARCH_SLUG_FIELD . '.value', $pattern, 'LIKE');
    }
    if (isset($field_definitions['field_research_body'])) {
      $or->condition('field_research_body.value', $pattern, 'LIKE');
    }
    if (isset($field_definitions['field_research_sections'])) {
      $or->condition('field_research_sections.value', $pattern, 'LIKE');
    }
    if (isset($field_definitions['body'])) {
      $or->condition('body.value', $pattern, 'LIKE');
    }

    $nids = $entity_query
      ->condition($or)
      ->range(0, 100)
      ->execute();

    if (empty($nids)) {
      return [];
    }

    $nodes = $this->nodeStorage->loadMultiple($nids);

    $results = [];
    foreach ($nodes as $node) {
      if ($node instanceof NodeInterface && $node->access('view')) {
        $results[] = $node;
      }
    }

    usort($results, function (NodeInterface $a, NodeInterface $b) use ($query): int {
      $a_title_match = mb_stripos($a->label(), $query) !== FALSE;
      $b_title_match = mb_stripos($b->label(), $query) !== FALSE;

      if ($a_title_match !== $b_title_match) {
        return $b_title_match <=> $a_title_match;
      }

      return $a->label() <=> $b->label();
    });

    return $results;
  }

  /**
   * Builds search page content.
   *
   * @param list<\Drupal\node\NodeInterface> $results
   *   Matching sustainability nodes.
   */
  protected function buildSearchResultsContent(string $query, array $results): array {
    $content = [
      '#type' => 'container',
      '#attributes' => [
        'class' => ['space-y-4'],
      ],
    ];

    if ($query === '') {
      $content['summary'] = [
        '#type' => 'html_tag',
        '#tag' => 'p',
        '#value' => (string) $this->t('Enter a keyword in the search field above to search CUD sustainability content.'),
        '#attributes' => [
          'class' => ['text-sm', 'leading-7', 'text-slate-600'],
        ],
      ];

      return $content;
    }

    $content['summary'] = [
      '#type' => 'html_tag',
      '#tag' => 'p',
      '#value' => (string) $this->t('@count result(s) found for "@query".', [
        '@count' => (string) count($results),
        '@query' => $query,
      ]),
      '#attributes' => [
        'class' => ['text-sm', 'font-medium', 'leading-7', 'text-slate-700'],
      ],
    ];

    if ($results === []) {
      $content['empty'] = [
        '#type' => 'html_tag',
        '#tag' => 'p',
        '#value' => (string) $this->t('No sustainability pages matched your search.'),
        '#attributes' => [
          'class' => ['text-sm', 'leading-7', 'text-slate-600'],
        ],
      ];

      return $content;
    }

    foreach ($results as $delta => $node) {
      $content['result_' . $delta] = [
        '#type' => 'container',
        '#attributes' => [
          'class' => ['rounded-2xl', 'border', 'border-slate-200', 'bg-white', 'px-5', 'py-4', 'shadow-sm'],
        ],
        'title' => [
          '#type' => 'link',
          '#title' => $node->label(),
          '#url' => $this->buildSearchResultUrl($node),
          '#attributes' => [
            'class' => ['text-lg', 'font-semibold', 'tracking-tight', 'text-slate-900', 'transition-colors', 'hover:text-sky-700'],
          ],
        ],
        'excerpt' => [
          '#type' => 'html_tag',
          '#tag' => 'p',
          '#value' => $this->buildSearchExcerpt($node, $query),
          '#attributes' => [
            'class' => ['mt-2', 'text-sm', 'leading-6', 'text-slate-600'],
          ],
        ],
      ];
    }

    return $content;
  }

  /**
   * Builds a search-results link for a sustainability node.
   */
  protected function buildSearchResultUrl(NodeInterface $node): Url {
    $slug = $this->getNodeSlug($node);

    if ($slug !== '') {
      return Url::fromRoute('cud_sustainability.sub_pages', ['slug' => $slug]);
    }

    return $node->toUrl();
  }

  /**
   * Returns the configured sustainability slug for a node.
   */
  protected function getNodeSlug(NodeInterface $node): string {
    if (!$node->hasField(static::RESEARCH_SLUG_FIELD) || $node->get(static::RESEARCH_SLUG_FIELD)->isEmpty()) {
      return '';
    }

    return trim((string) $node->get(static::RESEARCH_SLUG_FIELD)->value);
  }

  /**
   * Collects plain text used for search matching.
   */
  protected function buildSearchableText(NodeInterface $node): string {
    $parts = [$node->label()];

    foreach (['field_research_body', 'body'] as $field_name) {
      if (!$node->hasField($field_name) || $node->get($field_name)->isEmpty()) {
        continue;
      }

      foreach ($node->get($field_name) as $item) {
        $parts[] = trim((string) preg_replace('/\s+/u', ' ', strip_tags((string) ($item->value ?? ''))));
      }
    }

    if ($node->hasField('field_research_sections') && !$node->get('field_research_sections')->isEmpty()) {
      foreach ($node->get('field_research_sections') as $item) {
        $parts[] = trim((string) preg_replace('/\s+/u', ' ', strip_tags((string) ($item->value ?? ''))));
      }
    }

    return trim(implode(' ', array_filter($parts, function ($value) {
      return $value !== '';
    })));
  }

  /**
   * Builds a short excerpt for a search result.
   */
  protected function buildSearchExcerpt(NodeInterface $node, string $query): string {
    $text = $this->buildSearchableText($node);
    if ($text === '') {
      return (string) $this->t('Open this sustainability page to view the full content.');
    }

    $offset = mb_stripos($text, $query);
    if ($offset === FALSE) {
      $offset = 0;
    }

    $start = max(0, $offset - 70);
    $excerpt = trim(mb_substr($text, $start, 180));

    if ($start > 0) {
      $excerpt = '... ' . $excerpt;
    }
    if (mb_strlen($text) > $start + 180) {
      $excerpt .= ' ...';
    }

    return $excerpt;
  }

  /**
   * Builds the common sustainability page shell.
   *
   * Sets #theme directly to the resolved suggestion hook so Drupal selects the
   * correct template without relying on hook_theme_suggestions timing.
   */
  protected function buildPage(string $title, array $content, string $variant, array $carousel_items = [], array $sections = [], array $primary_nav = [], array $secondary_nav = []): array {
    return [
      '#theme' => $this->variantToThemeHook($variant),
      '#title' => $title,
      '#content' => $content,
      '#variant' => $variant,
      '#carousel_items' => $carousel_items,
      '#sections' => $sections,
      '#primary_nav' => $primary_nav,
      '#secondary_nav' => $secondary_nav,
      '#cache' => [
        'contexts' => [
          'url.path',
        ],
      ],
    ];
  }

  /**
   * Converts a variant string to its registered Drupal theme hook name.
   *
   * The architecture:
   *   page--cud-sustainability.html.twig  = page shell (header/nav/footer)
   *                                         used for ALL /sustainability routes
   *   cud-sustainability--main.html.twig  = inner content for /sustainability
   *   cud-sustainability--normal.html.twig = inner content fallback
   *   cud-sustainability--{path}.html.twig = inner content for specific routes
   *
   * Mapping: variant string '--' segments → '__' machine name separators.
   *   'main'                       → cud_sustainability__main
   *   'our-commitment--governance' → cud_sustainability__our_commitment__governance
   *   anything not in hook_theme() → cud_sustainability__normal (fallback)
   */
  protected function variantToThemeHook(string $variant): string {
    if ($variant === '' || $variant === 'normal') {
      return 'cud_sustainability__normal';
    }

    if ($variant === 'main') {
      return 'cud_sustainability__main';
    }

    // Split on '--' (path-segment separator), sanitise each segment to
    // underscores, then join with '__'. This mirrors Drupal's -- ↔ __ convention.
    $parts = explode('--', strtolower($variant));
    $machine_parts = array_map(static function (string $p): string {
      return preg_replace('/[^a-z0-9]+/', '_', $p);
    }, $parts);

    $hook = 'cud_sustainability__' . implode('__', $machine_parts);

    // Fall back to the normal template when no dedicated template is registered
    // for this specific path. This ensures any /sustainability/* URL that lacks
    // its own template always renders cud-sustainability--normal.html.twig.
    $registry = \Drupal::service('theme.registry')->get();
    if (!isset($registry[$hook])) {
      return 'cud_sustainability__normal';
    }

    return $hook;
  }


}
