export declare class ZeaTreeItemElement {
    updateSelectedId: any;
    updateVisibilityId: any;
    visibilityIcon: any;
    updateHighlightId: any;
    nameChangedId: BigInteger;
    childAddedId: any;
    childRemovedId: any;
    itemContainer: any;
    label: string;
    isRoot: boolean;
    isTreeItem: boolean;
    isSelected: boolean;
    isVisible: boolean;
    isHighlighted: boolean;
    treeItem: any;
    appData: any;
    isExpanded: boolean;
    childItems: any;
    rootElement: HTMLElement;
    /**
     * Placeholder comment
     */
    treeItemChanged(): void;
    /**
     * Placeholder comment
     */
    componentWillLoad(): void;
    /**
     * Placeholder comment
     */
    componentDidLoad(): void;
    /**
     * Placeholder comment
     */
    initTreeItem(): void;
    /**
     * Placeholder comment
     */
    updateSelected(): void;
    /**
     * Placeholder comment
     */
    updateVisibility(): void;
    /**
     * Placeholder comment
     */
    updateHighlight(): void;
    /**
     * Placeholder comment
     */
    private toggleChildren;
    /**
     * Placeholder comment
     */
    onVisibilityToggleClick(): void;
    /**
     * Placeholder comment
     * @param {any} e The event object
     */
    onLabelClick(e: any): void;
    /**
     * Main render method for the component
     * @return {JSX} The generated markup
     */
    render(): any;
}
