import { generateRecommendations } from "./ai-ml/pipeline/recommendationEngine.js";

// Mock Data for Testing
const mockResume = {
  skills: ["React", "Node.js", "MongoDB", "Express", "JavaScript", "Tailwind CSS"],
  experience: ["2 years as Full Stack Developer", "Developed 5+ web applications"],
  resumeText: "Experienced Full Stack Developer with expertise in React and Node.js. Skilled in MongoDB and building scalable web apps."
};

const mockJobs = [
  {
    _id: "job1",
    title: "Senior React Developer",
    skills: ["React", "Redux", "TypeScript"],
    description: "Looking for an expert React developer with at least 5 years of experience."
  },
  {
    _id: "job2",
    title: "Junior Node.js Backend",
    skills: ["Node.js", "Express", "MongoDB"],
    description: "Great entry-level role for someone who knows the MERN stack basics."
  },
  {
    _id: "job3",
    title: "Python Data Scientist",
    skills: ["Python", "Pandas", "Machine Learning"],
    description: "Data-heavy role requiring deep math knowledge."
  }
];

async function runTest() {
  console.log("🚀 Starting Recommendation Engine Test...");
  
  try {
    const results = await generateRecommendations(mockResume, mockJobs);
    
    console.log("\n--- RANKED RECOMMENDATIONS ---");
    results.forEach((rec, index) => {
      const job = mockJobs.find(j => j._id === rec.jobId);
      console.log(`${index + 1}. [${rec.score}%] ${job.title}`);
      console.log(`   Insights: ${rec.relevanceInsights}`);
      console.log(`   Skills Match: ${rec.skillMatch}% | Exp Match: ${rec.experienceMatch}%`);
      console.log('------------------------------');
    });

    if (results[0].jobId === 'job2' && results[results.length-1].jobId === 'job3') {
      console.log("\n✅ Test Passed: Junior Node.js (Best Match) and Python (Worst Match) ranked correctly!");
    } else {
      console.log("\n⚠️ Test Warning: Check if the scores align with your expectations.");
    }

  } catch (error) {
    console.error("❌ Test Failed:", error);
  }
}

runTest();
