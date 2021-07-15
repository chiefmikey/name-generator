const Name = require('../../db/models/Name');

exports.get = async (req, res) => {
  try {
    const results = await Name.find({
      birthday: req.query.birthday,
      fruit: req.query.fruit,
      animal: req.query.animal,
    });
    res.status(200).send(results);
  } catch (error) {
    console.log(error);
    res.status(200).send(false);
  }
};

exports.add = async (req, res) => {
  try {
    const newName = await new Name({
      emotion: req.body.emotion,
      normalEmotion: req.body.normalEmotion,
      emoEmotion: req.body.emoEmotion,
      animal: req.body.animal,
      petName: req.body.petName,
      birthday: req.body.birthday,
      fruit: req.body.fruit,
      sugar: req.body.sugar,
      result: req.body.result,
      mainResult: req.body.mainResult,
      emoResult: req.body.emoResult,
    });
    const save = await newName.save();
    res.status(200).send('Saved');
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

// exports.edit = async (req, res) => {
//   try {
//     const newName = new Name({
//       input: '',
//       name: '',
//     });
//     // newName.validate();
//     const save = await newName.save();
//     res.status(200).send('Name Updated');
//   } catch (error) {
//     res.status(400).send(error);
//   }
// };

// exports.delete = async (req, res) => {
//   try {
//     const remove = await Name.findByIdAndRemove();
//     res.status(200).send('Name Deleted');
//   } catch (error) {
//     res.status(400).send(error);
//   }
// };
