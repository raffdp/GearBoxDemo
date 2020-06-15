'use strict';

const index$2 = require('./index-c6995bed.js');

// Given a menu, return whether or not the menu toggle should be visible
const updateVisibility = async (menu) => {
    const menuEl = await index$2.menuController.get(menu);
    return !!(menuEl && await menuEl.isActive());
};

exports.updateVisibility = updateVisibility;
