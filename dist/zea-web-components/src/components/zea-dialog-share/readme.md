# zea-dialog-share



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description | Type      | Default |
| -------- | --------- | ----------- | --------- | ------- |
| `shown`  | `shown`   |             | `boolean` | `false` |


## Dependencies

### Used by

 - [zea-app-shell](../zea-app-shell)

### Depends on

- [zea-dialog](../zea-dialog)
- [zea-tabs](../zea-tabs)
- [zea-qr-code](../zea-qr-code)
- [zea-copy-link](../zea-copy-link)

### Graph
```mermaid
graph TD;
  zea-dialog-share --> zea-dialog
  zea-dialog-share --> zea-tabs
  zea-dialog-share --> zea-qr-code
  zea-dialog-share --> zea-copy-link
  zea-copy-link --> zea-icon
  zea-icon --> ion-icon
  zea-app-shell --> zea-dialog-share
  style zea-dialog-share fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
