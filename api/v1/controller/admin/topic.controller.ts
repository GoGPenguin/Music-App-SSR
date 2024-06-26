import { Request, Response } from "express";
import { Topic } from "../../models/topic.model";

// [GET] /api/v1/topics
export const index = async (req: Request, res: Response) => {
  const { searchKey, currentPage, perPage } = req.query;
  const currentPageValue = parseInt(currentPage as string) || 1;
  const perPageValue = parseInt(perPage as string) || null;
  let query = {};
  if (searchKey) {
    query = {
      name: new RegExp(searchKey as string, "i"),
    };
  }

  try {
    const topics = await Topic.find({
      ...query,
      status: "active",
      deleted: false,
    })
      .skip((currentPageValue - 1) * perPageValue)
      .limit(perPageValue);

    res.status(200).json({ topics: topics });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};

// [GET] /api/v1/topics/detail/:idTopic
export const detail = async (req: Request, res: Response) => {
  const { idTopic } = req.params;
  if (!idTopic) {
    return res.status(400).json({
      message: "Missing required fields",
    });
  }

  try {
    const topic = await Topic.findOne({
      _id: idTopic,
      status: "active",
      deleted: false,
    });

    if (!topic) {
      return res.status(404).json({
        message: "Topic not found",
      });
    }

    res.status(200).json({ topic });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};

// [POST] /api/v1/topics/create
export const create = async (req: Request, res: Response) => {
  const { name, description } = req.body;
  if (!name || !description) {
    return res.status(400).json({
      message: "Missing required fields",
    });
  }

  try {
    const topic = new Topic({
      name,
      description,
    });

    await topic.save();
    res.status(201).json({ topic });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};

// [PATCH] /api/v1/topics/edit/:idTopic
export const edit = async (req: Request, res: Response) => {
  const { idTopic } = req.params;
  const { title, description, avatar } = req.body;
  if (!idTopic || !title || !description || !avatar) {
    return res.status(400).json({
      message: "Missing required fields",
    });
  }

  try {
    const topic = await Topic.findOne({
      _id: idTopic,
      status: "active",
      deleted: false,
    });

    if (!topic) {
      return res.status(404).json({
        message: "Topic not found",
      });
    }

    topic.title = title;
    topic.description = description;
    topic.avatar = avatar;

    await topic.save();
    res.status(200).json({ topic });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};

// [DELETE] /api/v1/topics/delete/:idTopic
export const deleteTopic = async (req: Request, res: Response) => {
  const { idTopic } = req.params;
  if (!idTopic) {
    return res.status(400).json({
      message: "Missing required fields",
    });
  }

  try {
    const topic = await Topic.findOne({
      _id: idTopic,
      status: "active",
      deleted: false,
    });

    if (!topic) {
      return res.status(404).json({
        message: "Topic not found",
      });
    }

    topic.deleted = true;
    await topic.save();
    res.status(200).json({ message: "Delete topic successfully" });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};
