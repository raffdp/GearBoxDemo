# zea-file-system-browser



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute   | Description                                     | Type     | Default     |
| ---------- | ----------- | ----------------------------------------------- | -------- | ----------- |
| `filter`   | `filter`    | Display only FS Objects that match this filter. | `string` | `''`        |
| `folderId` | `folder-id` | Folder Id inside project.                       | `string` | `undefined` |
| `project`  | `project`   | Zea project.                                    | `any`    | `undefined` |


## Events

| Event          | Description | Type               |
| -------------- | ----------- | ------------------ |
| `changeFolder` |             | `CustomEvent<any>` |


## Dependencies

### Depends on

- ion-button
- ion-icon
- [zea-breadcrumbs](../zea-breadcrumbs)
- [zea-thumbnail](../zea-thumbnail)
- [zea-images-gallery](../zea-images-gallery)
- [zea-markdown-viewer](../zea-markdown-viewer)
- [zea-dialog](../zea-dialog)
- [zea-tabs](../zea-tabs)
- ion-list
- ion-item
- ion-label

### Graph
```mermaid
graph TD;
  zea-file-system-browser --> ion-button
  zea-file-system-browser --> ion-icon
  zea-file-system-browser --> zea-breadcrumbs
  zea-file-system-browser --> zea-thumbnail
  zea-file-system-browser --> zea-images-gallery
  zea-file-system-browser --> zea-markdown-viewer
  zea-file-system-browser --> zea-dialog
  zea-file-system-browser --> zea-tabs
  zea-file-system-browser --> ion-list
  zea-file-system-browser --> ion-item
  zea-file-system-browser --> ion-label
  ion-button --> ion-ripple-effect
  zea-breadcrumbs --> ion-icon
  ion-item --> ion-icon
  ion-item --> ion-ripple-effect
  style zea-file-system-browser fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
