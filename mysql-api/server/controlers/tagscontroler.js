const Tags = require('../models/tagsmodel.js');


exports.list_all_tags = function (req,res) {
  try {
    Tags.getAllTags().then((tags) => {
        res.json(tags);
      }
    ).catch(
      (err)=>{
         res.json(err);
      }
    )
  } catch (err) {/*console.log(err)*/}
};
function validate_tag(tag) {
  if (!String(tag.text).match(/.*\S.*/) || tag.text.length > 20)
      return false;
  return true;
}
/*exports.list_user_tags = function (req, res) {
  try {
    Tags.getUserTags(req.jwt.userId, function (err, tags) {
      if (err)
        return res.send(err);
      else
        res.send(tags);
    });
  } catch (err) { }
};
*/
exports.create_a_tag = function (req, res) {
  //console.log(req.body);
  var tags = req.body.newtags;
  var selectedtags = req.body.selectedtags;
  var user_id = req.body.user_id;
  for (tag in tags) {
    if (!validate_tag(tags[tag]))
      continue;
    try{
      Tags.createTag(tags[tag], (err) => {
      if (err)
        res.end({ err: err.msg });
    })
  } catch (err) { }
  }
  try{
  Tags.deleteTags(user_id, (err) => {
    if (err)
      res.end({ err: err.msg });
  })
  } catch (err) { }
  for (tag in selectedtags) {
    try{
    Tags.AssignTag(selectedtags[tag], user_id, (err) => {
      if (err)
        res.end({ err: err.msg });
    })
    } catch (err) { }
  }
  res.json({ ok: true });
};