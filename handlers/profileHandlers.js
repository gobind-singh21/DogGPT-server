const getProfileEmail = (req, res) => {
    const userEmail = req.user.email;
    res.status(200).json({ email: userEmail });
};

const updateProfile = (req, res) => {
    console.log("Req received", req.body);
    res.status(200).json({ message: "Request received" });
};

export { getProfileEmail, updateProfile };