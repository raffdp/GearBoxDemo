# zea-dialog-profile

<!-- Auto Generated Below -->


## Properties

| Property     | Attribute     | Description | Type      | Default     |
| ------------ | ------------- | ----------- | --------- | ----------- |
| `allowClose` | `allow-close` |             | `boolean` | `true`      |
| `showLabels` | `show-labels` |             | `boolean` | `true`      |
| `shown`      | `shown`       |             | `boolean` | `false`     |
| `userData`   | `user-data`   |             | `any`     | `undefined` |


## Dependencies

### Used by

 - [zea-app-shell](../zea-app-shell)
 - [zea-user-card](../zea-user-card)

### Depends on

- [zea-dialog](../zea-dialog)
- [zea-scroll-pane](../zea-scroll-pane)
- [zea-form-profile](../zea-form-profile)

### Graph
```mermaid
graph TD;
  zea-dialog-profile --> zea-dialog
  zea-dialog-profile --> zea-scroll-pane
  zea-dialog-profile --> zea-form-profile
  zea-form-profile --> zea-form
  zea-form-profile --> zea-input-text
  zea-form-profile --> zea-input
  zea-form --> zea-button
  zea-input --> zea-icon
  zea-icon --> ion-icon
  zea-app-shell --> zea-dialog-profile
  zea-user-card --> zea-dialog-profile
  style zea-dialog-profile fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
