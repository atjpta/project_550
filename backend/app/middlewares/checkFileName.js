const Image = require('../models').image

exports.ckeckNameImage = async (req, res, next) => {
    const { filename } = req.params;
    console.log(filename);
    try {
        const file = await Image.findOne({
            filename: filename,
        })
        if (file) {
            return res.status(400).send({message : `ảnh đã có trong db`});
        }
        else return next();
    } catch (error) {
        return res.status(500).send(`lỗi khi ckeckNameImage ${error}`);
    }

}
