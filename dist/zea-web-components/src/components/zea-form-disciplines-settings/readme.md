# zea-form-disciplines-settings



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute     | Description | Type     | Default  |
| ------------- | ------------- | ----------- | -------- | -------- |
| `contentId`   | `content-id`  |             | `string` | `'none'` |
| `disciplines` | `disciplines` |             | `any`    | `[]`     |


## Events

| Event          | Description | Type               |
| -------------- | ----------- | ------------------ |
| `dialogResize` |             | `CustomEvent<any>` |


## Dependencies

### Used by

 - [zea-dialog-drawing-settings](../zea-dialog-drawing-settings)

### Depends on

- [zea-input-text](../zea-input-text)
- [zea-input](../zea-input)
- [zea-button](../zea-button)
- [zea-menu-separator](../zea-menu-separator)
- [zea-menu](../zea-menu)
- [zea-menu-item](../zea-menu-item)
- [zea-icon](../zea-icon)
- [zea-scroll-pane](../zea-scroll-pane)

### Graph
```mermaid
graph TD;
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
  zea-dialog-drawing-settings --> zea-form-disciplines-settings
  style zea-form-disciplines-settings fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
