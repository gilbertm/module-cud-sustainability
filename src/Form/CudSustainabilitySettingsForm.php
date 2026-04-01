<?php

declare(strict_types=1);

namespace Drupal\cud_sustainability\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Settings form for CUD Sustainability module configuration.
 */
class CudSustainabilitySettingsForm extends ConfigFormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'cud_sustainability_settings_form';
  }

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return ['cud_sustainability.settings'];
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $config = $this->config('cud_sustainability.settings');

    $form['logo_filename'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Module logo filename'),
      '#default_value' => $config->get('logo_filename') ?? 'logo.png',
      '#maxlength' => 255,
      '#description' => $this->t('Filename under modules/custom/cud_sustainability/assets/images. Example: logo.png'),
      '#required' => FALSE,
    ];

    $form['contact_url'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Submit Sustainability button URL'),
      '#default_value' => $config->get('contact_url') ?? '/sustainability/contact',
      '#maxlength' => 512,
      '#description' => $this->t('URL for the primary call-to-action button in the sustainability page header. Use an internal path (e.g. /sustainability/contact) or a full external URL.'),
      '#required' => FALSE,
    ];

    return parent::buildForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {
    $value = trim((string) $form_state->getValue('logo_filename'));

    if ($value === '') {
      parent::validateForm($form, $form_state);
      return;
    }

    if ($value !== basename($value)) {
      $form_state->setErrorByName('logo_filename', $this->t('Provide only a filename, not a path.'));
    }

    if (!preg_match('/^[A-Za-z0-9._-]+$/', $value)) {
      $form_state->setErrorByName('logo_filename', $this->t('Use only letters, numbers, dot, underscore, and dash.'));
    }

    parent::validateForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $filename = trim((string) $form_state->getValue('logo_filename'));
    $filename = $filename === '' ? '' : basename($filename);

    $contact_url = trim((string) $form_state->getValue('contact_url'));

    $this->configFactory->getEditable('cud_sustainability.settings')
      ->set('logo_filename', $filename)
      ->set('contact_url', $contact_url)
      ->save();

    parent::submitForm($form, $form_state);
  }

}
