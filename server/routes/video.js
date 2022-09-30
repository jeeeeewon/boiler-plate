const express = require('express');
const router = express.Router();
const { Video } = require("../models/Video");

const multer = require("multer");
const ffmpeg = require('fluent-ffmpeg');

//=================================
//             Video
//=================================

//STORAGE MULTER CONFIG
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'video/mp4' || 'image/jpg' || 'image/png') {
        cb(null, true);
    } else {
        return cb({msg: "only jpg, png, mp4 is allowed"}, false);
    }
}

const upload = multer({ storage: storage, fileFilter: fileFilter }).single("file");

router.post("/uploads", (req, res) => {
    //client에서 받은 video를 server에 저장
    upload(req, res, err => {
        if(err) {
            return res.json({ success: false, err })
        }
        return res.json({ success: true, url: res.req.file.path, filename: res.req.file.filename })
    });
});

router.post("/thumbnails", (req, res) => {
    let filePath = "";
    let fileDuration = "";

    //썸네일 생성, 비디오 러닝타임 가져오기
    ffmpeg.ffprobe(req.body.url, function(err, metadata) {
        console.dir(metadata);
        console.log(metadata.format.duration);
        fileDuration = metadata.format.duration
    });
    ffmpeg(req.body.url)
        .on('filenames', function(filenames) {
            console.log('Will generate ' + filenames.join(', '))
            console.log(filenames)

            filePath = "uploads/thumbnails/" + filenames[0]
        })
        .on('end', function() {
            console.log("Screenshots taken");
            return res.json({ success: true, url: filePath, fileDuration: fileDuration})
        })
        .on('error', function (err) {
            console.log(err);
            return res.json({ success: false, err});
        })
        .screenshots({
            count: 3,
            folder: "uploads/thumbnails",
            size: '320x240',
            filename: "thumbnail-%b.png"
        })
});

router.post("/uploadVideo", (req, res) => {
    //비디오 정보들을 저장한다
    const video = new Video(req.body);

    video.save((err, doc) => {
        if(err) return res.json({ success: false, err })
        res.status(200).json({ success: true })
    });
});

router.get("/getVideos", (req, res) => {
    //비디오를 db에서 가져와서 클라이언트에 보내기
    Video.find()
        .populate('writer')
        .exec((err, videos) => {
            if(err) return res.status(400).send(err);
            res.status(200).json({ success: true, videos })
        })
})

module.exports = router;
