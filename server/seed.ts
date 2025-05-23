import mongoose from "mongoose";
import dotenv from "dotenv";
import Course from "./src/models/Course";
import Lesson, { ILesson, ILessonInput } from "./src/models/Lesson";
import LessonProgress from "./src/models/LessonProgress";
import Vocabulary from "./src/models/Vocabulary";
import Exercise from "./src/models/Exercise";
import History from "./src/models/History";
import ExerciseVocabulary from "./src/models/ExerciseVocabulary";

// Define interface for vocabulary items
interface VocabularyItem {
    word: string;
    phonetic?: string;
    meaning: string;
    exampleSentence: string;
    sound: string;
}

// Define interfaces for the returned documents
interface IVocabularyDoc {
    _id: mongoose.Types.ObjectId;
    lessonId: mongoose.Types.ObjectId;
}

interface IExerciseDoc {
    _id: mongoose.Types.ObjectId;
    lessonId: mongoose.Types.ObjectId;
}

dotenv.config();

const seed = async () => {
    await mongoose.connect(process.env.MONGO_URI as string, {
        dbName: "speak-up",
    });
    console.log("Connected to MongoDB");

    // Clear existing data to avoid duplicates
    await Course.deleteMany({});
    await Lesson.deleteMany({});
    await LessonProgress.deleteMany({});
    await Vocabulary.deleteMany({});
    await Exercise.deleteMany({});
    await History.deleteMany({});
    await ExerciseVocabulary.deleteMany({});

    // Create course
    const course = await Course.create({
        _id: new mongoose.Types.ObjectId("6819c20302afe322ee61b1d2"),
        title: "English Pronunciation with IPA",
        description: "Master English pronunciation using the International Phonetic Alphabet",
        level: "beginner",
        thumbnail: "https://dummyimage.com/600x400/000/fff",
        createdAt: new Date("2025-05-06T08:02:11.316Z"),
        updatedAt: new Date("2025-05-06T08:02:11.316Z"),
    });

    // Create parent lessons based on IPA
    const parentLessonsData: ILessonInput[] = [
        {
            courseId: course._id as mongoose.Types.ObjectId,
            title: "Ending Sounds",
            content: "Practice consonant sounds at the end of words",
            type: "pronunciation",
            level: 1,
            thumbnail: "http://localhost:8080/static/circle.png",
            createdAt: new Date("2025-05-06T08:02:11.316Z"),
            updatedAt: new Date("2025-05-06T08:02:11.316Z"),
        },
        {
            courseId: course._id as mongoose.Types.ObjectId,
            title: "/iː/ vs /ɪ/",
            content: "Distinguish between long /iː/ and short /ɪ/ vowel sounds",
            type: "pronunciation",
            level: 1,
            thumbnail: "http://localhost:8080/static/circle_1.png",
            createdAt: new Date("2025-05-06T08:02:11.316Z"),
            updatedAt: new Date("2025-05-06T08:02:11.316Z"),
        },
        {
            courseId: course._id as mongoose.Types.ObjectId,
            title: "/æ/, /ʌ/, /ɑː/",
            content: "Practice the vowel sounds /æ/, /ʌ/, and /ɑː/",
            type: "pronunciation",
            level: 1,
            thumbnail: "http://localhost:8080/static/circle_2.png",
            createdAt: new Date("2025-05-06T08:02:11.316Z"),
            updatedAt: new Date("2025-05-06T08:02:11.316Z"),
        },
        {
            courseId: course._id as mongoose.Types.ObjectId,
            title: "/ð/ vs /θ/",
            content: "Distinguish between voiced /ð/ and voiceless /θ/ sounds",
            type: "pronunciation",
            level: 1,
            thumbnail: "http://localhost:8080/static/circle_3.png",
            createdAt: new Date("2025-05-06T08:02:11.316Z"),
            updatedAt: new Date("2025-05-06T08:02:11.316Z"),
        },
        {
            courseId: course._id as mongoose.Types.ObjectId,
            title: "/r/, /z/, /ʃ/",
            content: "Practice the consonant sounds /r/, /z/, and /ʃ/",
            type: "pronunciation",
            level: 1,
            thumbnail: "http://localhost:8080/static/circle_4.png",
            createdAt: new Date("2025-05-06T08:02:11.316Z"),
            updatedAt: new Date("2025-05-06T08:02:11.316Z"),
        },
        {
            courseId: course._id as mongoose.Types.ObjectId,
            title: "Intonation",
            content: "Learn English intonation patterns",
            type: "pronunciation",
            level: 1,
            thumbnail: "http://localhost:8080/static/circle_5.png",
            createdAt: new Date("2025-05-06T08:02:11.316Z"),
            updatedAt: new Date("2025-05-06T08:02:11.316Z"),
        },
        {
            courseId: course._id as mongoose.Types.ObjectId,
            title: "Longer Words",
            content: "Practice pronunciation of longer words and phrases",
            type: "pronunciation",
            level: 2,
            thumbnail: "http://localhost:8080/static/circle_6.png",
            createdAt: new Date("2025-05-06T08:02:11.316Z"),
            updatedAt: new Date("2025-05-06T08:02:11.316Z"),
        },
    ];

    const parentLessons: ILesson[] = await Lesson.insertMany(
        parentLessonsData.map(lesson => ({
            ...lesson,
            thumbnail: course?.thumbnail,
        }))
    ) as unknown as ILesson[];

    // Create sub-lessons with IPA-focused content
    const subLessonsData: ILessonInput[] = [];

    // "Ending Sounds" - 38 sub-lessons (final consonants)
    const endingSounds = ["/p/", "/b/", "/t/", "/d/", "/k/", "/g/", "/f/", "/v/", "/θ/", "/ð/", "/s/", "/z/", "/ʃ/", "/ʒ/", "/h/", "/tʃ/", "/dʒ/", "/m/", "/n/", "/ŋ/"];
    for (let i = 0; i < 38; i++) {
        const sound = endingSounds[i % endingSounds.length];
        subLessonsData.push({
            courseId: course._id as mongoose.Types.ObjectId,
            parentLessonId: parentLessons[0]._id as mongoose.Types.ObjectId,
            title: `Lesson ${i + 1} - Ending Sound ${sound}`,
            content: `Practice words ending with ${sound}: e.g., "stop" (/stɒp/) for /p/, "rub" (/rʌb/) for /b/.`,
            type: "pronunciation",
            level: 1,
            thumbnail: "",
            createdAt: new Date("2025-05-06T08:02:11.445Z"),
            updatedAt: new Date("2025-05-06T08:02:11.445Z"),
        });
    }

    // "/iː/ vs /ɪ/" - 14 sub-lessons
    const iSounds = [
        "Listen and distinguish /iː/ vs /ɪ/",
        "Words with /iː/: sheep, see, feel",
        "Words with /ɪ/: ship, sit, fill",
        "Minimal pairs: seat/sit, beat/bit",
        "Sentences with /iː/: She reads books.",
        "Sentences with /ɪ/: I sit here.",
        "Practice /iː/ in isolation",
        "Practice /ɪ/ in isolation",
        "Combine /iː/ and /ɪ/ in words",
        "Combine /iː/ and /ɪ/ in phrases",
        "Record yourself: /iː/ vs /ɪ/",
        "Feedback on /iː/ pronunciation",
        "Feedback on /ɪ/ pronunciation",
        "Review /iː/ and /ɪ/ together",
    ];
    for (let i = 0; i < 14; i++) {
        subLessonsData.push({
            courseId: course._id as mongoose.Types.ObjectId,
            parentLessonId: parentLessons[1]._id as mongoose.Types.ObjectId,
            title: `Lesson ${i + 1} - ${iSounds[i]}`,
            content: `Focus on ${iSounds[i].toLowerCase()}. Example: /iː/ in "see" (/siː/), /ɪ/ in "sit" (/sɪt/).`,
            type: "pronunciation",
            level: 1,
            thumbnail: "",
            createdAt: new Date("2025-05-06T08:02:11.445Z"),
            updatedAt: new Date("2025-05-06T08:02:11.445Z"),
        });
    }

    // "/æ/, /ʌ/, /ɑː/" - 7 sub-lessons
    const aSounds = [
        "Introduction to /æ/, /ʌ/, /ɑː/",
        "Words with /æ/: cat, hat, bat",
        "Words with /ʌ/: cup, but, cut",
        "Words with /ɑː/: car, father, far",
        "Minimal pairs: cat/cut, car/cup",
        "Sentences practice",
        "Review and record",
    ];
    for (let i = 0; i < 7; i++) {
        subLessonsData.push({
            courseId: course._id as mongoose.Types.ObjectId,
            parentLessonId: parentLessons[2]._id as mongoose.Types.ObjectId,
            title: `Lesson ${i + 1} - ${aSounds[i]}`,
            content: `Practice ${aSounds[i].toLowerCase()}. Example: /æ/ in "cat" (/kæt/), /ʌ/ in "cup" (/kʌp/), /ɑː/ in "car" (/kɑːr/).`,
            type: "pronunciation",
            level: 1,
            thumbnail: "",
            createdAt: new Date("2025-05-06T08:02:11.445Z"),
            updatedAt: new Date("2025-05-06T08:02:11.445Z"),
        });
    }

    // "/ð/ vs /θ/" - 7 sub-lessons
    const thSounds = [
        "Introduction to /ð/ vs /θ/",
        "Words with /θ/: think, bath, teeth",
        "Words with /ð/: this, mother, breathe",
        "Minimal pairs: think/this",
        "Sentences with /θ/",
        "Sentences with /ð/",
        "Review and record",
    ];
    for (let i = 0; i < 7; i++) {
        subLessonsData.push({
            courseId: course._id as mongoose.Types.ObjectId,
            parentLessonId: parentLessons[3]._id as mongoose.Types.ObjectId,
            title: `Lesson ${i + 1} - ${thSounds[i]}`,
            content: `Practice ${thSounds[i].toLowerCase()}. Example: /θ/ in "think" (/θɪŋk/), /ð/ in "this" (/ðɪs/).`,
            type: "pronunciation",
            level: 1,
            thumbnail: "",
            createdAt: new Date("2025-05-06T08:02:11.445Z"),
            updatedAt: new Date("2025-05-06T08:02:11.445Z"),
        });
    }

    // "/r/, /z/, /ʃ/" - 7 sub-lessons
    const rzsSounds = [
        "Introduction to /r/, /z/, /ʃ/",
        "Words with /r/: red, car, run",
        "Words with /z/: zoo, buzz, nose",
        "Words with /ʃ/: shoe, wash, sure",
        "Minimal pairs: rose/rows",
        "Sentences practice",
        "Review and record",
    ];
    for (let i = 0; i < 7; i++) {
        subLessonsData.push({
            courseId: course._id as mongoose.Types.ObjectId,
            parentLessonId: parentLessons[4]._id as mongoose.Types.ObjectId,
            title: `Lesson ${i + 1} - ${rzsSounds[i]}`,
            content: `Practice ${rzsSounds[i].toLowerCase()}. Example: /r/ in "red" (/rɛd/), /z/ in "zoo" (/zuː/), /ʃ/ in "shoe" (/ʃuː/).`,
            type: "pronunciation",
            level: 1,
            thumbnail: "",
            createdAt: new Date("2025-05-06T08:02:11.445Z"),
            updatedAt: new Date("2025-05-06T08:02:11.445Z"),
        });
    }

    // "Intonation" - 5 sub-lessons
    const intonationLessons = [
        "Introduction to English intonation",
        "Rising intonation: Yes/No questions",
        "Falling intonation: Statements",
        "Mixed intonation: Choice questions",
        "Practice and record",
    ];
    for (let i = 0; i < 5; i++) {
        subLessonsData.push({
            courseId: course._id as mongoose.Types.ObjectId,
            parentLessonId: parentLessons[5]._id as mongoose.Types.ObjectId,
            title: `Lesson ${i + 1} - ${intonationLessons[i]}`,
            content: `Practice ${intonationLessons[i].toLowerCase()}. Example: Rising in "Are you okay?" (/ɑːr jə ʊˈkeɪ/), Falling in "I’m fine." (/aɪm faɪn/).`,
            type: "pronunciation",
            level: 1,
            thumbnail: "",
            createdAt: new Date("2025-05-06T08:02:11.445Z"),
            updatedAt: new Date("2025-05-06T08:02:11.445Z"),
        });
    }

    // "Longer Words" - 2 sub-lessons
    const longerWords = [
        "Practice basic longer words",
        "Practice phrases with longer words",
    ];
    for (let i = 0; i < 2; i++) {
        subLessonsData.push({
            courseId: course._id as mongoose.Types.ObjectId,
            parentLessonId: parentLessons[6]._id as mongoose.Types.ObjectId,
            title: `Lesson ${i + 1} - ${longerWords[i]}`,
            content: `Practice ${longerWords[i].toLowerCase()}. Example: "international" (/ˌɪntərˈnæʃənl/), "The weather is nice." (/ðə ˈwɛðər ɪz naɪs/).`,
            type: "pronunciation",
            level: 2,
            thumbnail: "",
            createdAt: new Date("2025-05-06T08:02:11.511Z"),
            updatedAt: new Date("2025-05-06T08:02:11.511Z"),
        });
    }

    const subLessons: ILesson[] = await Lesson.insertMany(subLessonsData) as unknown as ILesson[];

    // Initialize arrays for vocabulary, exercises, exercise-vocabulary links, and history
    const vocabularyData: Array<{
        lessonId: mongoose.Types.ObjectId;
        word: string;
        phonetic?: string;
        meaning: string;
        exampleSentence: string;
        audioUrl: string;
        createdAt: Date;
        updatedAt: Date;
    }> = [];
    const exercisesData: Array<{
        lessonId: mongoose.Types.ObjectId;
        type: "repeat_sentence" | "fill_in_blank" | "pronunciation" | "listening";
        prompt: string;
        correctPronunciation: string;
        difficultyLevel: "easy" | "medium" | "hard";
        createdAt: Date;
        updatedAt: Date;
    }> = [];
    const exerciseVocabularyData: Array<{
        exerciseId: mongoose.Types.ObjectId;
        vocabularyId: mongoose.Types.ObjectId;
        createdAt: Date;
        updatedAt: Date;
    }> = [];
    const historyData: Array<{
        userId: mongoose.Types.ObjectId;
        lessonId: mongoose.Types.ObjectId;
        exerciseId: mongoose.Types.ObjectId;
        attempts: number;
        lastAttemptAt: Date;
        createdAt: Date;
        updatedAt: Date;
    }> = [];
    const userId = new mongoose.Types.ObjectId("6814e1d4f941dc16637b6235");

    // Sample vocabulary data for each sub-lesson group
    const endingSoundWords: VocabularyItem[] = [
        { word: "stop", phonetic: "/stɒp/", meaning: "to cease moving", exampleSentence: "I will stop the car.", sound: "/p/" },
        { word: "rub", phonetic: "/rʌb/", meaning: "to apply pressure and move", exampleSentence: "Rub the table with a cloth.", sound: "/b/" },
        { word: "cat", phonetic: "/kæt/", meaning: "a small domesticated animal", exampleSentence: "The cat is sleeping.", sound: "/t/" },
        { word: "bad", phonetic: "/bæd/", meaning: "not good", exampleSentence: "This is a bad idea.", sound: "/d/" },
        { word: "back", phonetic: "/bæk/", meaning: "the rear surface", exampleSentence: "Stand with your back straight.", sound: "/k/" },
        { word: "dog", phonetic: "/dɒɡ/", meaning: "a common pet", exampleSentence: "The dog barks loudly.", sound: "/g/" },
        { word: "leaf", phonetic: "/liːf/", meaning: "part of a plant", exampleSentence: "A leaf fell from the tree.", sound: "/f/" },
        { word: "love", phonetic: "/lʌv/", meaning: "deep affection", exampleSentence: "I love my family.", sound: "/v/" },
        { word: "bath", phonetic: "/bæθ/", meaning: "a washing container", exampleSentence: "Take a bath tonight.", sound: "/θ/" },
        { word: "this", phonetic: "/ðɪs/", meaning: "indicating something close", exampleSentence: "This is my book.", sound: "/ð/" },
        { word: "bus", phonetic: "/bʌs/", meaning: "a large vehicle", exampleSentence: "The bus is late.", sound: "/s/" },
        { word: "buzz", phonetic: "/bʌz/", meaning: "a humming sound", exampleSentence: "I hear a buzz from the bee.", sound: "/z/" },
        { word: "wash", phonetic: "/wɒʃ/", meaning: "to clean with water", exampleSentence: "Wash your hands.", sound: "/ʃ/" },
        { word: "beige", phonetic: "/beɪʒ/", meaning: "a light brown color", exampleSentence: "The wall is beige.", sound: "/ʒ/" },
        { word: "path", phonetic: "/pæθ/", meaning: "a way or track", exampleSentence: "Walk down the path.", sound: "/θ/" },
        { word: "church", phonetic: "/tʃɜːrtʃ/", meaning: "a place of worship", exampleSentence: "We go to church on Sunday.", sound: "/tʃ/" },
        { word: "judge", phonetic: "/dʒʌdʒ/", meaning: "to form an opinion", exampleSentence: "The judge made a decision.", sound: "/dʒ/" },
        { word: "room", phonetic: "/ruːm/", meaning: "a space", exampleSentence: "This room is big.", sound: "/m/" },
        { word: "sun", phonetic: "/sʌn/", meaning: "the star", exampleSentence: "The sun is shining.", sound: "/n/" },
        { word: "sing", phonetic: "/sɪŋ/", meaning: "to produce musical sounds", exampleSentence: "She can sing well.", sound: "/ŋ/" },
    ];

    const iSoundWords: VocabularyItem[] = [
        { word: "sheep", phonetic: "/ʃiːp/", meaning: "a farm animal", exampleSentence: "The sheep are grazing.", sound: "/iː/" },
        { word: "ship", phonetic: "/ʃɪp/", meaning: "a large boat", exampleSentence: "The ship sailed away.", sound: "/ɪ/" },
        { word: "see", phonetic: "/siː/", meaning: "to perceive with the eyes", exampleSentence: "I can see the mountain.", sound: "/iː/" },
        { word: "sit", phonetic: "/sɪt/", meaning: "to rest on the buttocks", exampleSentence: "Please sit down.", sound: "/ɪ/" },
    ];

    const aSoundWords: VocabularyItem[] = [
        { word: "cat", phonetic: "/kæt/", meaning: "a small domesticated animal", exampleSentence: "The cat is playful.", sound: "/æ/" },
        { word: "cup", phonetic: "/kʌp/", meaning: "a small container", exampleSentence: "Drink from the cup.", sound: "/ʌ/" },
        { word: "car", phonetic: "/kɑːr/", meaning: "a vehicle", exampleSentence: "The car is fast.", sound: "/ɑː/" },
    ];

    const thSoundWords: VocabularyItem[] = [
        { word: "think", phonetic: "/θɪŋk/", meaning: "to consider", exampleSentence: "I think about you.", sound: "/θ/" },
        { word: "this", phonetic: "/ðɪs/", meaning: "indicating something close", exampleSentence: "This is my house.", sound: "/ð/" },
    ];

    const rzsSoundWords: VocabularyItem[] = [
        { word: "red", phonetic: "/rɛd/", meaning: "a color", exampleSentence: "The apple is red.", sound: "/r/" },
        { word: "zoo", phonetic: "/zuː/", meaning: "a place for animals", exampleSentence: "We visited the zoo.", sound: "/z/" },
        { word: "shoe", phonetic: "/ʃuː/", meaning: "footwear", exampleSentence: "Put on your shoe.", sound: "/ʃ/" },
    ];

    const intonationWords: VocabularyItem[] = [
        { word: "okay", phonetic: "/əʊˈkeɪ/", meaning: "acceptable", exampleSentence: "Are you okay?", sound: "intonation" },
        { word: "fine", phonetic: "/faɪn/", meaning: "good", exampleSentence: "I’m feeling fine.", sound: "intonation" },
    ];

    const longerWordsData: VocabularyItem[] = [
        { word: "international", phonetic: "/ˌɪntərˈnæʃənl/", meaning: "between nations", exampleSentence: "This is an international event.", sound: "" },
        { word: "weather", phonetic: "/ˈwɛðər/", meaning: "atmospheric conditions", exampleSentence: "The weather is nice today.", sound: "" },
    ];

    // Track unique words to avoid duplicates
    const existingWords = new Set<string>();

    // Create Vocabulary, Exercise, ExerciseVocabulary, and History for each sub-lesson
    for (const subLesson of subLessons) {
        let vocabWords: VocabularyItem[] = [];
        let lessonSound = subLesson.title.match(/\/[^/]+\//)?.[0] as string || "";

        if (subLesson.parentLessonId instanceof mongoose.Types.ObjectId && subLesson.parentLessonId.equals(parentLessons[0]._id as mongoose.Types.ObjectId)) {
            vocabWords = endingSoundWords.filter(w => w.sound === lessonSound);
        } else if (subLesson.parentLessonId instanceof mongoose.Types.ObjectId && subLesson.parentLessonId.equals(parentLessons[1]._id as mongoose.Types.ObjectId)) {
            if (subLesson.title.includes("/iː/") && !subLesson.title.includes("vs")) {
                vocabWords = iSoundWords.filter(w => w.sound === "/iː/");
            } else if (subLesson.title.includes("/ɪ/") && !subLesson.title.includes("vs")) {
                vocabWords = iSoundWords.filter(w => w.sound === "/ɪ/");
            } else {
                vocabWords = iSoundWords;
            }
        } else if (subLesson.parentLessonId instanceof mongoose.Types.ObjectId && subLesson.parentLessonId.equals(parentLessons[2]._id as mongoose.Types.ObjectId)) {
            if (subLesson.title.includes("/æ/") && !subLesson.title.includes("Introduction") && !subLesson.title.includes("Minimal pairs")) {
                vocabWords = aSoundWords.filter(w => w.sound === "/æ/");
            } else if (subLesson.title.includes("/ʌ/") && !subLesson.title.includes("Introduction") && !subLesson.title.includes("Minimal pairs")) {
                vocabWords = aSoundWords.filter(w => w.sound === "/ʌ/");
            } else if (subLesson.title.includes("/ɑː/") && !subLesson.title.includes("Introduction") && !subLesson.title.includes("Minimal pairs")) {
                vocabWords = aSoundWords.filter(w => w.sound === "/ɑː/");
            } else {
                vocabWords = aSoundWords;
            }
        } else if (subLesson.parentLessonId instanceof mongoose.Types.ObjectId && subLesson.parentLessonId.equals(parentLessons[3]._id as mongoose.Types.ObjectId)) {
            if (subLesson.title.includes("/θ/") && !subLesson.title.includes("vs")) {
                vocabWords = thSoundWords.filter(w => w.sound === "/θ/");
            } else if (subLesson.title.includes("/ð/") && !subLesson.title.includes("vs")) {
                vocabWords = thSoundWords.filter(w => w.sound === "/ð/");
            } else {
                vocabWords = thSoundWords;
            }
        } else if (subLesson.parentLessonId instanceof mongoose.Types.ObjectId && subLesson.parentLessonId.equals(parentLessons[4]._id as mongoose.Types.ObjectId)) {
            if (subLesson.title.includes("/r/") && !subLesson.title.includes("Introduction") && !subLesson.title.includes("Minimal pairs")) {
                vocabWords = rzsSoundWords.filter(w => w.sound === "/r/");
            } else if (subLesson.title.includes("/z/") && !subLesson.title.includes("Introduction") && !subLesson.title.includes("Minimal pairs")) {
                vocabWords = rzsSoundWords.filter(w => w.sound === "/z/");
            } else if (subLesson.title.includes("/ʃ/") && !subLesson.title.includes("Introduction") && !subLesson.title.includes("Minimal pairs")) {
                vocabWords = rzsSoundWords.filter(w => w.sound === "/ʃ/");
            } else {
                vocabWords = rzsSoundWords;
            }
        } else if (subLesson.parentLessonId instanceof mongoose.Types.ObjectId && subLesson.parentLessonId.equals(parentLessons[5]._id as mongoose.Types.ObjectId)) {
            vocabWords = intonationWords;
        } else if (subLesson.parentLessonId instanceof mongoose.Types.ObjectId && subLesson.parentLessonId.equals(parentLessons[6]._id as mongoose.Types.ObjectId)) {
            vocabWords = longerWordsData;
        }

        // Create Vocabulary for the sub-lesson, avoiding duplicates
        for (const vocab of vocabWords) {
            if (!existingWords.has(vocab.word)) {
                const vocabulary = {
                    lessonId: subLesson._id as mongoose.Types.ObjectId,
                    word: vocab.word,
                    phonetic: vocab.phonetic,
                    meaning: vocab.meaning,
                    exampleSentence: vocab.exampleSentence,
                    audioUrl: `https://example.com/audio/${vocab.word}.mp3`,
                    createdAt: new Date("2025-05-06T08:02:11.445Z"),
                    updatedAt: new Date("2025-05-06T08:02:11.445Z"),
                };
                vocabularyData.push(vocabulary);
                existingWords.add(vocab.word);
            }
        }

        // Create Exercise for the sub-lesson
        const exercise = {
            lessonId: subLesson._id as mongoose.Types.ObjectId,
            type: "pronunciation" as const,
            prompt: `Practice pronouncing the sound in "${vocabWords[0]?.word || 'word'}"`,
            correctPronunciation: vocabWords[0]?.phonetic || lessonSound || "N/A",
            difficultyLevel: "easy" as const,
            createdAt: new Date("2025-05-06T08:02:11.445Z"),
            updatedAt: new Date("2025-05-06T08:02:11.445Z"),
        };
        exercisesData.push(exercise);
    }

    const vocabularies = await Vocabulary.insertMany(vocabularyData) as IVocabularyDoc[];
    const exercises = await Exercise.insertMany(exercisesData) as IExerciseDoc[];

    // Create ExerciseVocabulary to link Exercise and Vocabulary
    for (let i = 0; i < exercises.length; i++) {
        const subLessonVocabs = vocabularies.filter(v => {
            if (v.lessonId instanceof mongoose.Types.ObjectId && exercises[i].lessonId instanceof mongoose.Types.ObjectId) {
                return v.lessonId.equals(exercises[i].lessonId);
            }
            return false;
        });
        for (const vocab of subLessonVocabs) {
            exerciseVocabularyData.push({
                exerciseId: exercises[i]._id as mongoose.Types.ObjectId,
                vocabularyId: vocab._id as mongoose.Types.ObjectId,
                createdAt: new Date("2025-05-06T08:02:11.445Z"),
                updatedAt: new Date("2025-05-06T08:02:11.445Z"),
            });
        }

        // Create History for each Exercise
        historyData.push({
            userId,
            lessonId: exercises[i].lessonId as mongoose.Types.ObjectId,
            exerciseId: exercises[i]._id as mongoose.Types.ObjectId,
            attempts: 2,
            lastAttemptAt: new Date("2025-05-06T09:00:00.000Z"),
            createdAt: new Date("2025-05-06T08:02:11.445Z"),
            updatedAt: new Date("2025-05-06T09:00:00.000Z"),
        });
    }

    await ExerciseVocabulary.insertMany(exerciseVocabularyData);
    await History.insertMany(historyData);

    // Create LessonProgress for all sub-lessons
    const userIdProgress = new mongoose.Types.ObjectId("6814e1d4f941dc16637b6235");
    const progressData = subLessons.map(lesson => ({
        lessonId: lesson._id as mongoose.Types.ObjectId,
        userId: userIdProgress,
        score: 0,
        createdAt: new Date("2025-05-06T08:02:11.575Z"),
        updatedAt: new Date("2025-05-06T08:02:11.575Z"),
    }));

    await LessonProgress.insertMany(progressData);

    console.log("Seed completed successfully");
    await mongoose.connection.close();
};

seed().catch(err => {
    console.error(err);
    process.exit(1);
});