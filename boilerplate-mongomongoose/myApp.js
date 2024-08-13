require("dotenv").config();
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

let Person;

const personSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
  favoritefoods: [String],
});

Person = mongoose.model("Person", personSchema);

const createAndSavePerson = (person_object, done) => {
  const person = new Person(person_object);
  person.save(function (err, data) {
    if (err) return console.error(err);
    done(null, data);
  });
};

const arrayOfPeople = [
  { name: "Frankie", age: 74, favoriteFoods: ["Del Taco"] },
  { name: "Sol", age: 76, favoriteFoods: ["roast chicken"] },
  { name: "Robert", age: 78, favoriteFoods: ["wine"] },
];

const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, function (err, data) {
    if (err) return console.error(err);
    done(null, data);
  });
};

const findPeopleByName = (personName, done) => {
  Person.find({ name: personName }, (err, peopleFound) => {
    if (err) return console.log(err);
    else if (peopleFound.length === 0) console.error("no such person found");
    done(null, peopleFound);
  });
};

const findOneByFood = (food, done) => {
  Person.findOne({ favoritefoods: food }, (err, data) => {
    if (err) return console.log(err);
    done(null, data);
  });
};

const findPersonById = (personId, done) => {
  Person.findById(personId, (err, data) => {
    if (err) return console.log(err);
    done(null, data);
  });
};

const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";

  Person.findById(personId, (err, personFound) => {
    if (err) return console.log(err);
    personFound.favoritefoods.push(foodToAdd);
    personFound.save(function (err, updatedPerson) {
      if (err) return console.error(err);
      done(null, updatedPerson);
    });
  });
};

const findAndUpdate = (personName, done) => {
  const ageToSet = 20;

  Person.findOneAndUpdate(
    { name: personName },
    { age: 20 },
    { new: true, runValidators: true },
    (err, updatedPerson) => {
      if (err) {
        return console.error(err);
      } else if (updatedPerson == null) {
        return console.error("no such person found");
      } else done(null, updatedPerson);
    }
  );
};

const removeById = (personId, done) => {
  Person.findOneAndRemove({ _id: personId }, (err, removedDoc) => {
    if (err) return console.error(err);
    done(null, removedDoc);
  });
};

const removeManyPeople = (done) => {
  const nameToRemove = "Mary";

  Person.remove({ name: nameToRemove }, (err, response) => {
    if (err) return console.error(err);
    done(null, response);
  });
};

const queryChain = (done) => {
  const foodToSearch = "burrito";

  const findQuery = Person.find({ favoritefoods: foodToSearch });
  findQuery
    .sort({ name: 1 })
    .limit(2)
    .select({ age: 0 })
    .exec((err, response) => {
      if (err) return console.error(err);
      done(null, response);
    });
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
