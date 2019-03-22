const express = require("express")

const Project = require("../data/helpers/projectModel")

const router = express.Router()

router.post("/", async (req, res) => {
  const { name, description, completed } = req.body
  if ([name, description].some(field => field == null)) {
    res.status(400).json({
      message: "Please provide the name and description for the project."
    })
  } else {
    try {
      const project = await Project.insert({ name, description, completed })
      res.status(201).json(project)
    } catch (error) {
      console.log(error)
      res.status(500).json({
        message: "Error creating the project."
      })
    }
  }
})

router.get("/", async (_req, res) => {
  try {
    const projects = await Project.get()
    res.status(200).json(projects)
  } catch (error) {
    console.log(JSON.stringify(error, null, 2))
    res.status(500).json({
      message: "Error finding the projects."
    })
  }
})

router.get("/:id", async (req, res) => {
  const { id } = req.params
  try {
    const project = await Project.get(id)
    project == null
      ? res.status(404).json({
          message: `There is no project with id ${id}.`
        })
      : res.status(200).json(project)
  } catch (error) {
    console.log(JSON.stringify(error, null, 2))
    res.status(500).json({
      message: "Error finding the project."
    })
  }
})

router.delete("/:id", async (req, res) => {
  const { id } = req.params
  try {
    const project = await Project.get(id)
    project == null
      ? res.status(404).json({
          message: `There is no project with id ${id}.`
        })
      : Project.remove(id).then(() => {
          res.status(200).json({
            message: "The project was deleted."
          })
        })
  } catch (error) {
    console.log(JSON.stringify(error, null, 2))
    res.status(500).json({
      message: "Error finding the project."
    })
  }
})

router.put("/:id", async (req, res) => {
  const { id } = req.params
  const { name, description, completed } = req.body
  if ([name, description, completed].every(field => field == null)) {
    res.status(400).json({
      message:
        "Please provide any of the following to update the project: name, description, or completed."
    })
  } else {
    try {
      const project = await Project.get(id)
      project == null
        ? res.status(404).json({
            message: `There is no project with id ${id}.`
          })
        : Project.update(id, {
            name,
            description,
            completed
          }).then(project => {
            res.status(200).json(project)
          })
    } catch (error) {
      console.log(JSON.stringify(error, null, 2))
      res.status(500).json({
        message: "Could not update the project."
      })
    }
  }
})

module.exports = router
