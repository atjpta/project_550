const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const DB = require("../models");
const model = DB.question;


const elastic = require('../elastic')
const client = elastic.client


exports.search = async (req, res, next) => {
    const { textsearch } = req.params
    try {
        const body = await client.search({
            index: 'question',
            body: {
                query: {
                    more_like_this: {
                        fields: ['title', 'content'],
                        like: textsearch,
                        min_term_freq: 1,
                        min_doc_freq: 1,
                        max_query_terms: 12,
                        minimum_should_match: '30%',
                    }
                }
            }
        })
        const hits = body.hits.hits.map(hit => {
            return {
                id: hit._source.id,
                score: hit._score,
                title: hit._source.title,
                content: hit._source.content,
            };
        });
        return res.send(hits);
    } catch (error) {
        console.log(error);
        res.send(error)
    }
}

// exports.search = async (req, res, next) => {
//     const { textsearch } = req.params
//     let i = 0
//     try {
//         const results = await model.find({
//             $text: {
//                 $search: textsearch,
//                 $caseSensitive: false,
//                 $diacriticSensitive: false,
//             },
//         }, {
//             score: {
//                 $meta: "textScore"
//             }
//         }).sort({
//             'score': 1,
//         })

//         const highlightedResults = results.map((result) => {
//             const highlightedContent = result.contentOnlyText.replace(new RegExp(textsearch, 'gi'), `<mark>${textsearch}</mark>`);
//             const highlightedTitle = result.title.replace(new RegExp(textsearch, 'gi'), `<mark>${textsearch}</mark>`);
//             return { ...result.toObject(), id: result, title: highlightedTitle, contentOnlyText: highlightedContent };
//         });

//         res.send(highlightedResults)
//     } catch (error) {
//         console.log(error);
//         res.send(error)
//     }
// }