const resolveItems = (asset, group, paths) => {
  paths.forEach((path) => {
    try {
      const item = asset.resolvePath(path);
      group.addItem(item);
    } catch (e) {
      console.log(e);
    }
  });
};

export { resolveItems };
