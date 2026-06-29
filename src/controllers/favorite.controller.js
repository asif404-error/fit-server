const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");

const getFavorites = async (req, res, next) => {
  try {
    const db = getDB();
    const favorites = await db
      .collection("favorites")
      .find({ userEmail: req.params.email })
      .toArray();

    const populated = await Promise.all(
      favorites.map(async (fav) => {
        const cls = await db
          .collection("classes")
          .findOne({ _id: new ObjectId(fav.classId) });
        return { ...fav, ...cls, _id: fav._id, classId: fav.classId };
      })
    );

    res.json({ success: true, data: populated });
  } catch (err) {
    next(err);
  }
};

const checkFavorite = async (req, res, next) => {
  try {
    const db = getDB();
    const { email, classId } = req.query;
    const favorite = await db
      .collection("favorites")
      .findOne({ userEmail: email, classId });
    res.json({ success: true, isFavorite: !!favorite });
  } catch (err) {
    next(err);
  }
};

const addFavorite = async (req, res, next) => {
  try {
    const db = getDB();
    const { email, classId } = req.body;

    const existing = await db
      .collection("favorites")
      .findOne({ userEmail: email, classId });

    if (existing) {
      return res.status(400).json({ success: false, message: "Already in favorites" });
    }

    const result = await db.collection("favorites").insertOne({
      userEmail: email,
      classId,
      addedAt: new Date(),
    });

    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

const removeFavorite = async (req, res, next) => {
  try {
    const db = getDB();
    const { email, classId } = req.body;
    await db
      .collection("favorites")
      .deleteOne({ userEmail: email, classId });
    res.json({ success: true, message: "Removed from favorites" });
  } catch (err) {
    next(err);
  }
};

module.exports = { getFavorites, checkFavorite, addFavorite, removeFavorite };