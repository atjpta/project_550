const elastic = require('../elastic')
const client = elastic.client
const DB = require("../models");
const model = DB.question;


exports.getDataFormDB = async (req, res, next) => {
    try {
        const questions = await model.find()
        questions.forEach(async (question) => {
            await client.index({
                index: 'question',
                body: {
                    id: question.id,
                    title: question.title,
                    content: question.contentOnlyText,
                }
            });
        });
        res.send({
            Message: 'đã thêm xong thành công'
        })
    } catch (error) {
        res.send(error)
    }
};


exports.create = async (req, res, next) => {
    try {
        await client.indices.create({
            index: 'question',
            body: {
                settings: {
                    analysis: {
                        analyzer: {
                            "vietnamese_analyzer": {
                                "type": "custom",
                                "tokenizer": "icu_tokenizer",

                                "filter": [
                                    "lowercase",
                                    "stopwords_filter",
                                    "icu_folding"
                                ]
                            }
                        },
                        "filter": {
                            "stopwords_filter": {
                                "type": "stop",
                                "stopwords_path": "stopwords.txt"
                            }
                        }
                    }
                },
                mappings: {
                    properties: {
                        id: {
                            type: 'text',
                            analyzer: 'vietnamese_analyzer'
                        },
                        title: {
                            type: 'text',
                            analyzer: 'vietnamese_analyzer'
                        },
                        content: {
                            type: 'text',
                            analyzer: 'vietnamese_analyzer'
                        }
                    }
                }
            }
        })
        res.send({
            Message: 'tạo index thành công'
        })
    } catch (error) {
        res.send(error)
    }
};



exports.delete = async (req, res, next) => {
    try {
        await client.indices.delete({
            index: 'question'
        });
        res.send({
            Message: 'xóa index thành công'
        })
    } catch (error) {
        res.send(error)
    }
};


