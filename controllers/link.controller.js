import { nanoid } from "nanoid";
import { Link } from "../models/Link.js";

export const getLinks = async (req, res) => {
  try {
    const links = await Link.find({ uid: req.uid });

    return res.json({ links });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};

export const getLink = async (req, res) => {
  try {
    const { nanoLink } = req.params;
    const link = await Link.findOne({ nanoLink });

    if (!link) return res.status(404).json({ error: "The link doesn't exist" });

    return res.json({ longLink: link.longLink });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(403).json({ error: "Incorrect id format" });
    }
    return res.status(500).json({ error: "Server error" });
  }
};

// Para un CRUD tradicional
export const getLinkCRUD = async (req, res) => {
  try {
    const { id } = req.params;
    const link = await Link.findById(id);
    if (!link) return res.status(404).json({ error: "The link doesn't exis" });
    if (!link.uid.equals(req.uid))
      return res.status(401).json({ error: "The id doesn't belong to you" });
    return res.json({ link });
  } catch (error) {
    console.log(error);
    if (error.kind === "ObjectId") {
      return res.status(403).json({ error: "Incorrect id format" });
    }
    return res.status(500).json({ error: "Server error" });
  }
};

export const createLink = async (req, res) => {
  try {
    let { longLink } = req.body;
    if (!longLink.startsWith("https://")) {
      longLink = "https://" + longLink;
    }
    console.log(longLink);

    const link = new Link({ longLink, nanoLink: nanoid(6), uid: req.uid });
    const newLink = await link.save();

    return res.status(201).json({ newLink });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};

export const removeLink = async (req, res) => {
  try {
    const { id } = req.params;
    const link = await Link.findById(id);

    if (!link) return res.status(404).json({ error: "The link doesn't exist" });

    if (!link.uid.equals(req.uid))
      return res.status(401).json({ error: "The id doesn't belong to you" });

    await link.remove();

    return res.json({ link });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(403).json({ error: "Incorrect id format" });
    }
    return res.status(500).json({ error: "Server error" });
  }
};

export const updateLink = async (req, res) => {
  try {
    const { id } = req.params;
    const { longLink } = req.body;

    console.log(longLink);

    if (!longLink.startsWith("https://")) {
      longLink = "https://" + longLink;
    }

    const link = await Link.findById(id);

    if (!link) return res.status(404).json({ error: "The link does'nt exist" });

    if (!link.uid.equals(req.uid))
      return res.status(401).json({ error: "The id doesn't belong to you" });

    // Update

    link.longLink = longLink;
    await link.save();

    return res.json({ link });
  } catch (error) {
    console.log(error);
    if (error.kind === "ObjectId") {
      return res.status(403).json({ error: "Incorrect id format" });
    }
    return res.status(500).json({ error: "Server error" });
  }
};
