/* CSS module mock: returns the class name itself for any property accessed, so
   `styles.container` in a test reads back as the string "container" */
module.exports = new Proxy(
    {},
    {
        get: (_target, property) => property,
    },
);
