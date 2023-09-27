import Category from "../Models/Category.js";

export const uploadFile = (req, res) => {
  const formattedDate = new Date()
    .toLocaleString("uk-UA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
    .replace(/\D+/g, "_");
  try {
    res.status(200).json({
      url: `/category_images/${formattedDate}--${req.file.originalname}`,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error,
    });
  }
};

export const create = async (req, res) => {
  try {
    const { name, image, slugString, subcategories } = req.body;
    const category = new Category({ name, image, slugString, subcategories });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the category" });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        error: "An error occurred while fetching the list of categories",
      });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the category" });
  }
};

export const getOneBySlug = async (req, res) => {
  try {
    const slug_str = req.params.slug_str;
    const category = await Category.findOne({ slugString: { $eq: slug_str } });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the category" });
  }
};

export const searchCategory = async (req, res) => {
  try {
    const categories = await Category.find({
      $or: [{ name: { $regex: req.params.name, $options: "i" } }],
    });
    if (categories) {
      res.status(200).json({
        success: true,
        categories: categories,
      });
    } else {
      res.status(404).json({
        success: false,
        error: "Not found",
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Error searching items" });
  }
};

export const update = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { name, image, slugString, subcategories } = req.body;
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { name, image, slugString, subcategories },
      { new: true }
    );
    if (!updatedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(updatedCategory);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the category" });
  }
};

export const remove = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const deletedCategory = await Category.findByIdAndRemove(categoryId);
    if (!deletedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json({ message: "Category successfully deleted" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the category" });
  }
};
