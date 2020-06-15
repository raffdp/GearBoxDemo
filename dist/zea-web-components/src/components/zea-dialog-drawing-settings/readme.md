# zea-dialog-drawing-settings



<!-- Auto Generated Below -->


## Properties

| Property     | Attribute     | Description | Type      | Default     |
| ------------ | ------------- | ----------- | --------- | ----------- |
| `allowClose` | `allow-close` |             | `boolean` | `true`      |
| `showLabels` | `show-labels` |             | `boolean` | `true`      |
| `shown`      | `shown`       |             | `boolean` | `false`     |
| `userData`   | `user-data`   |             | `any`     | `undefined` |


## Dependencies

### Depends on

- [zea-dialog](../zea-dialog)
- [zea-tabs](../zea-tabs)
- [zea-form-disciplines-settings](../zea-form-disciplines-settings)
- [zea-form-measurements-settings](../zea-form-measurements-settings)

### Graph
```mermaid
graph TD;
  zea-dialog-drawing-settings --> zea-dialog
  zea-dialog-drawing-settings --> zea-tabs
  zea-dialog-drawing-settings --> zea-form-disciplines-settings
  zea-dialog-drawing-settings --> zea-form-measurements-settings
  zea-form-disciplines-settings --> zea-input-text
  zea-form-disciplines-settings --> zea-input
  zea-form-disciplines-settings --> zea-button
  zea-form-disciplines-settings --> zea-menu-separator
  zea-form-disciplines-settings --> zea-menu
  zea-form-disciplines-settings --> zea-menu-item
  zea-form-disciplines-settings --> zea-icon
  zea-form-disciplines-settings --> zea-scroll-pane
  zea-input --> zea-icon
  zea-icon --> ion-icon
  zea-menu --> zea-icon
  zea-menu-item --> zea-checkbox
  zea-menu-item --> zea-switch
  style zea-dialog-drawing-settings fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
