function buildCategoryTree(categories) {
    if (!categories || categories.length === 0) return [];
    const categoryMap = new Map();

    categories.forEach(category => {
        categoryMap.set(category.id, { ...category, children: [] });
    });

    const tree = [];
    categoryMap.forEach(category => {
        const { id, parentID } = category;
        if (parentID === null) {
            tree.push(category);
        } else {
            const parentCategory = categoryMap.get(parentID);
            if (parentCategory) {
                parentCategory.children.push(category);
            }
        }
    });

    return tree;
}

module.exports = buildCategoryTree;