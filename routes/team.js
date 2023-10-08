const router = require("express").Router();
const Team = require("../model/team");
const { isAdminAndSrManager, verifyToken } = require("../middleware/access");

router.post("/", isAdminAndSrManager, async (req, res) => {
  const { name, managerId, teamLeadId, agents, createdBy } = req.body;

  if (!name || !managerId || !teamLeadId || !createdBy) {
    return res.status(403).json("Fields are required");
  }

  try {
    const team = new Team({
      name,
      managerId,
      teamLeadId,
      agents,
      createdBy,
    });

    await team.save();

    res.status(201).json("Team created successfully");
  } catch (err) {
    console.log(err);
    res.status(500).json("Internal Server Error");
  }
});

router.get("/", verifyToken, async (req, res) => {
  try {
    const user = req.user;
    let teams = [];

    if (user.role === "admin" || user.role === "sr_manager") {
      teams = await Team.find()
        .populate("managerId", "name")
        .populate("agents", "name");
    } else if (user.role === "manager") {
      teams = await Team.find({ managerId: user._id });
    } else if (user.role === "team_lead") {
      teams = await Team.find({ teamLeadId: user._id });
    } else if (user.role === "agent") {
      teams = await Team.find({
        agents: { $in: [user._id] },
      });
    }

    res.status(200).json(teams);
  } catch (err) {
    console.log(err);
    res.status(500).json("Internal Server Error");
  }
});

router.delete("/:id", isAdminAndSrManager, async (req, res) => {
  try {
    await Team.findByIdAndDelete(req.params.id);

    res.status(200).json("Team deleted successfully");
  } catch (err) {
    console.log(err);
    res.status(500).json("Internal Sercer Error");
  }
});

module.exports = router;
