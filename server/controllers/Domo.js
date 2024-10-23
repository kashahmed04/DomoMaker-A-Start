const makerPage = (req, res) => {
  res.render('app');
};

// We will do more with this in the next exercise. For now, we will
// just have it render out the main app page (can we render in any file
// to load the page how do we know which files we can render in)**
module.exports = {
  makerPage,
};
