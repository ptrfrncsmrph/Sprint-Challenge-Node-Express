const express = require("express")

const Action = require("../data/helpers/actionModel")

const router = express.Router()

// TODO: Add check for valid project ID
router.post("/", async (req, res) => {
  const { project_id, description, notes, completed } = req.body
  if ([project_id, description, notes].some(field => field == null)) {
    res.status(400).json({
      message:
        "Please provide the project ID, description and notes for the action."
    })
  } else {
    try {
      const action = await Action.insert({
        project_id,
        description,
        notes,
        completed
      })
      res.status(201).json(action)
    } catch (error) {
      console.log(error)
      res.status(500).json({
        message: "Error creating the action."
      })
    }
  }
})

router.get("/", async (_req, res) => {
  try {
    const actions = await Action.get()
    res.status(200).json(actions)
  } catch (error) {
    console.log(JSON.stringify(error, null, 2))
    res.status(500).json({
      message: "Error finding the actions."
    })
  }
})

router.get("/:id", async (req, res) => {
  const { id } = req.params
  try {
    const action = await Action.get(id)
    action == null
      ? res.status(404).json({
          message: `There is no action with id ${id}.`
        })
      : res.status(200).json(action)
  } catch (error) {
    console.log(JSON.stringify(error, null, 2))
    res.status(500).json({
      message: "Error finding the action."
    })
  }
})

router.delete("/:id", async (req, res) => {
  const { id } = req.params
  try {
    const action = await Action.get(id)
    action == null
      ? res.status(404).json({
          message: `There is no action with id ${id}.`
        })
      : Action.remove(id).then(() => {
          res.status(200).json({
            message: "The action was deleted."
          })
        })
  } catch (error) {
    console.log(JSON.stringify(error, null, 2))
    res.status(500).json({
      message: "Error finding the action."
    })
  }
})

// TODO: Add check for valid project ID
router.put("/:id", async (req, res) => {
  const { id } = req.params
  const { project_id, description, notes, completed } = req.body
  if (
    [project_id, description, notes, completed].every(field => field == null)
  ) {
    res.status(400).json({
      message:
        "Please provide any of the following to update the action: project ID, description or notes."
    })
  } else {
    try {
      const action = await Action.get(id)
      action == null
        ? res.status(404).json({
            message: `There is no action with id ${id}.`
          })
        : Action.update(id, { project_id, description, notes, completed }).then(
            action => {
              res.status(200).json(action)
            }
          )
    } catch (error) {
      console.log(JSON.stringify(error, null, 2))
      res.status(500).json({
        message: "Could not update the action."
      })
    }
  }
})

module.exports = router
