// UTF-8
window.examData = window.examData || {};
let selectedClass=null,selectedSubject=null,currentQuestions=[],currentIndex=0,currentScore=0,userAnswers=[];
const $=id=>document.getElementById(id);

function init(){
  const grid=$("classGrid");
  for(let c=6;c<=10;c++){
    grid.innerHTML+=`<div class="class-card" onclick="openClass(${c})"><div class="class-number">📘</div><h3>कक्षा ${c}</h3><p>विषय • अध्याय • Quiz</p></div>`;
    $("quizClass").innerHTML+=`<option value="${c}">कक्षा ${c}</option>`;
  }
  $("year").textContent=new Date().getFullYear();
  $("quizClass").addEventListener("change",fillQuizSubjects);
}
function toggleMenu(){document.querySelector("nav").classList.toggle("show")}
function openClass(c){
 selectedClass=c;$("classes").classList.add("hidden");$("content").classList.remove("hidden");
 $("contentTitle").textContent=`कक्षा ${c} — विषय चुनें`;
 const sg=$("subjectGrid");sg.innerHTML="";
 Object.entries(examData[c]).forEach(([name,d])=>{
   sg.innerHTML+=`<div class="subject-card" onclick="openSubject(${c},${JSON.stringify(name)})"><div class="subject-icon">${d.icon}</div><h3>${name}</h3><small>${d.chapters.length} अध्याय • ${d.questions.length} starter MCQ</small></div>`;
 });
 $("chapterArea").innerHTML="";
 location.hash="content";
}
function showClasses(){ $("content").classList.add("hidden");$("classes").classList.remove("hidden");location.hash="classes"; }
function openSubject(c,s){
 selectedClass=c;selectedSubject=s;const d=examData[c][s];
 $("contentTitle").textContent=`कक्षा ${c} — ${s}`;
 const area=$("chapterArea");
 area.innerHTML=`<div class="chapter-list"><h3>📚 अध्याय</h3>`+
 d.chapters.map((ch,i)=>`<article class="chapter"><div class="chapter-head"><h3>${i+1}. ${ch}</h3><div class="chapter-actions"><button class="mini read" onclick="toggleNote(${i})">📖 Notes</button><button class="mini take" onclick="startQuiz(${c},${JSON.stringify(s)})">📝 Quiz</button></div></div><div id="note${i}" class="chapter-note"><b>${d.notes[i%d.notes.length]}</b><br>यहाँ ${ch} के सरल Notes, सारांश, शब्दार्थ और महत्वपूर्ण प्रश्न-उत्तर जोड़ें। अपनी original शैक्षिक सामग्री यहां रखें।</div></article>`).join("")+`</div>`;
}
function toggleNote(i){$("note"+i).style.display=$("note"+i).style.display==="block"?"none":"block"}
function fillQuizSubjects(){
 const c=Number($("quizClass").value),s=$("quizSubject");s.innerHTML='<option value="">विषय चुनें</option>';
 if(examData[c])Object.keys(examData[c]).forEach(x=>s.innerHTML+=`<option value="${x}">${x}</option>`);
}
function startSelectedQuiz(){const c=Number($("quizClass").value),s=$("quizSubject").value;if(!c||!s){alert("पहले कक्षा और विषय चुनें।");return}startQuiz(c,s)}
function startQuiz(c,s){
 currentQuestions=examData[c][s].questions;selectedClass=c;selectedSubject=s;currentIndex=0;currentScore=0;userAnswers=[];
 $("quizBox").classList.remove("hidden");renderQuestion();$("quizBox").scrollIntoView({behavior:"smooth"});
}
function renderQuestion(){
 const q=currentQuestions[currentIndex];
 $("quizBox").innerHTML=`<div class="progress">प्रश्न ${currentIndex+1} / ${currentQuestions.length}</div><h3>${q[0]}</h3>`+
 q[1].map((o,i)=>`<button class="option" onclick="answer(${i})">${String.fromCharCode(65+i)}. ${o}</button>`).join("");
}
function answer(i){
 const q=currentQuestions[currentIndex];userAnswers.push({q:q[0],selected:i,correct:q[2]});
 if(i===q[2])currentScore++;
 currentIndex++;
 if(currentIndex<currentQuestions.length)renderQuestion();else showResult();
}
function showResult(){
 let review=userAnswers.map((x,i)=>`<p><b>${i+1}. ${x.q}</b><br>${x.selected===x.correct?'<span class="correct">✓ सही उत्तर</span>':'<span class="wrong">✗ गलत — सही विकल्प: '+String.fromCharCode(65+x.correct)+'</span>'}</p>`).join("");
 $("quizBox").innerHTML=`<div class="result"><div class="result-score">${currentScore} / ${currentQuestions.length}</div><h3>Quiz पूरा हुआ 🎉</h3><p>कक्षा ${selectedClass} • ${selectedSubject}</p><div class="review">${review}</div><button class="btn primary" onclick="startQuiz(selectedClass,selectedSubject)">फिर से Quiz दें</button></div>`;
}
init();