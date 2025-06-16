document.getElementById('hobbyQuizForm').addEventListener('submit', function(event) {
    event.preventDefault(); // ป้องกันการรีเฟรชหน้า

    const answers = {};
    const formElements = this.elements;

    // รวบรวมคำตอบจาก form
    for (let i = 0; i < formElements.length; i++) {
        const element = formElements[i];
        if (element.type === 'radio' && element.checked) {
            answers[element.name] = element.value;
        }
    }

    // ตรวจสอบว่าตอบครบทุกข้อหรือไม่
    const numQuestions = 8;
    if (Object.keys(answers).length < numQuestions) {
        document.getElementById('result').innerHTML = '<span style="color: red;">กรุณาตอบคำถามให้ครบทุกข้อก่อนค่ะ!</span>';
        return;
    }

    // คะแนนสำหรับแต่ละประเภทกิจกรรม
    let scores = {
        'อ่านหนังสือ': 0,
        'ดูหนัง/ซีรีส์': 0,
        'เล่นเกม': 0,
        'ออกกำลังกาย': 0,
        'ทำอาหาร/ขนม': 0,
        'อื่นๆ': 0
    };

    // ระบบให้คะแนนจากคำตอบ
    // Q1: กิจกรรมที่ใช้สมอง vs. ร่างกาย
    switch (answers.q1) {
        case 'creative':
            scores['อื่นๆ'] += 2; // ศิลปะ, ดนตรี
            scores['ทำอาหาร/ขนม'] += 1; // การสร้างสรรค์เมนู
            scores['อ่านหนังสือ'] += 0.5; // การคิดวิเคราะห์, จินตนาการ
            break;
        case 'physical':
            scores['ออกกำลังกาย'] += 3;
            break;
        case 'both':
            scores['อื่นๆ'] += 1;
            scores['ออกกำลังกาย'] += 1;
            scores['อ่านหนังสือ'] += 0.5;
            scores['ดูหนัง/ซีรีส์'] += 0.5;
            break;
    }

    // Q2: กิจกรรมแรกที่เลือกทำเมื่อมีเวลาว่าง 2-3 ชั่วโมง
    switch (answers.q2) {
        case 'media':
            scores['ดูหนัง/ซีรีส์'] += 3;
            break;
        case 'reading':
            scores['อ่านหนังสือ'] += 3;
            break;
        case 'social_media':
            scores['อื่นๆ'] += 1; // การใช้สื่อดิจิทัล
            break;
        case 'hobby': // "ทำงานอดิเรก/กิจกรรมส่วนตัว (เช่น ทำอาหาร, จัดสวน, เล่นเกม)"
            scores['ทำอาหาร/ขนม'] += 1.5;
            scores['เล่นเกม'] += 1.5;
            scores['อื่นๆ'] += 1; // สำหรับกิจกรรมส่วนตัวอื่นๆ เช่น จัดสวน
            break;
        case 'social':
            scores['อื่นๆ'] += 1.5; // การเข้าสังคม
            break;
    }

    // Q3: อยู่คนเดียว vs. อยู่กับคนอื่น
    switch (answers.q3) {
        case 'alone':
            scores['อ่านหนังสือ'] += 1.5;
            scores['ดูหนัง/ซีรีส์'] += 1.5;
            scores['เล่นเกม'] += 1.5;
            scores['ทำอาหาร/ขนม'] += 1.5;
            scores['อื่นๆ'] += 1; // กิจกรรมส่วนตัวอื่นๆ
            break;
        case 'social':
            scores['อื่นๆ'] += 2.5; // กิจกรรมที่ทำร่วมกับผู้อื่น
            scores['ออกกำลังกาย'] += 1; // เล่นกีฬาเป็นทีม
            scores['ดูหนัง/ซีรีส์'] += 0.5; // ดูหนังด้วยกัน
            scores['ทำอาหาร/ขนม'] += 0.5; // ทำอาหารกับเพื่อน/ครอบครัว
            break;
        case 'depends':
            // คะแนนกระจายตัวเล็กน้อย
            scores['อ่านหนังสือ'] += 0.5;
            scores['ดูหนัง/ซีรีส์'] += 0.5;
            scores['เล่นเกม'] += 0.5;
            scores['ออกกำลังกาย'] += 0.5;
            scores['ทำอาหาร/ขนม'] += 0.5;
            scores['อื่นๆ'] += 0.5;
            break;
    }

    // Q4: กิจกรรมที่ช่วยผ่อนคลายและลดความเครียด
    switch (answers.q4) {
        case 'media_relax':
            scores['ดูหนัง/ซีรีส์'] += 2.5;
            break;
        case 'reading_relax':
            scores['อ่านหนังสือ'] += 2.5;
            break;
        case 'exercise_relax':
            scores['ออกกำลังกาย'] += 2.5;
            break;
        case 'art_craft':
            scores['อื่นๆ'] += 2;
            break;
        case 'social_relax':
            scores['อื่นๆ'] += 1.5;
            break;
        case 'sleep_relax':
            scores['อื่นๆ'] += 1; // เป็นการพักผ่อนทั่วไป
            break;
    }

    // Q5: ทักษะใหม่ที่อยากเรียนรู้
    switch (answers.q5) {
        case 'language':
        case 'coding':
        case 'media_creation':
        case 'music':
            scores['อื่นๆ'] += 2; // ทักษะเฉพาะทาง
            break;
        case 'cooking':
            scores['ทำอาหาร/ขนม'] += 3;
            break;
        case 'sports_skill':
            scores['ออกกำลังกาย'] += 2.5;
            break;
    }

    // Q6: การวางแผนกิจกรรมในเวลาว่าง
    switch (answers.q6) {
        case 'plan':
            scores['ออกกำลังกาย'] += 0.5; // อาจวางแผนการออกกำลังกาย
            scores['อื่นๆ'] += 1; // สำหรับกิจกรรมที่ต้องเตรียมการ เช่น ท่องเที่ยว
            break;
        case 'spontaneous':
            scores['อ่านหนังสือ'] += 0.5;
            scores['ดูหนัง/ซีรีส์'] += 0.5;
            scores['เล่นเกม'] += 0.5;
            break;
        case 'mix':
            // ไม่มีคะแนนพิเศษ แต่ไม่ลด
            break;
    }

    // Q7: ประโยชน์ของงานอดิเรกต่อการพัฒนาตัวเอง
    switch (answers.q7) {
        case 'creativity':
            scores['ทำอาหาร/ขนม'] += 0.5;
            scores['อื่นๆ'] += 1; // ศิลปะ ดนตรี
            break;
        case 'problem_solving':
            scores['เล่นเกม'] += 1;
            scores['อื่นๆ'] += 0.5; // การเรียนรู้
            break;
        case 'social_skills':
            scores['อื่นๆ'] += 1.5;
            break;
        case 'time_management':
            // ไม่มีคะแนนพิเศษสำหรับหมวดใดหมวดหนึ่ง
            break;
        case 'health':
            scores['ออกกำลังกาย'] += 1.5;
            break;
        case 'no_effect':
            // ไม่มีผล
            break;
    }

    // Q8: การใช้เวลาว่างในวันหยุดยาวแบบไร้ข้อจำกัด
    switch (answers.q8) {
        case 'travel':
            scores['อื่นๆ'] += 2; // การเดินทาง
            break;
        case 'learn_intensive':
            scores['อ่านหนังสือ'] += 1; // เรียนรู้จากหนังสือ
            scores['อื่นๆ'] += 1.5; // คอร์ส, เวิร์กช็อป
            scores['ทำอาหาร/ขนม'] += 0.5; // คอร์สทำอาหาร
            scores['ออกกำลังกาย'] += 0.5; // คอร์สกีฬา
            break;
        case 'relax_home':
            scores['อ่านหนังสือ'] += 1;
            scores['ดูหนัง/ซีรีส์'] += 1;
            scores['เล่นเกม'] += 1;
            scores['ทำอาหาร/ขนม'] += 0.5;
            scores['อื่นๆ'] += 0.5; // กิจกรรมสบายๆ ที่บ้าน
            break;
        case 'hobby_focus':
            // ให้คะแนนกระจาย เพราะขึ้นอยู่กับ hobby นั้นๆ
            scores['อ่านหนังสือ'] += 0.5;
            scores['ดูหนัง/ซีรีส์'] += 0.5;
            scores['เล่นเกม'] += 0.5;
            scores['ออกกำลังกาย'] += 0.5;
            scores['ทำอาหาร/ขนม'] += 0.5;
            scores['อื่นๆ'] += 0.5;
            break;
        case 'family_time':
            scores['อื่นๆ'] += 1.5; // กิจกรรมร่วมกับครอบครัว
            break;
    }

    // หาประเภทกิจกรรมที่มีคะแนนสูงสุด
    let maxScore = -1;
    let preferredHobbyList = []; // เก็บกรณีที่มีหลายตัวเลือกคะแนนเท่ากัน

    for (const hobby in scores) {
        if (scores[hobby] > maxScore) {
            maxScore = scores[hobby];
            preferredHobbyList = [hobby]; // เริ่มต้นใหม่
        } else if (scores[hobby] === maxScore && maxScore > 0) {
            preferredHobbyList.push(hobby); // เพิ่มเข้าไปในลิสต์
        }
    }

    let resultMessage = '';
    if (maxScore === 0) { // กรณีที่ไม่มีคะแนนเลย หรือคำตอบไม่ชี้ไปที่กิจกรรมใดๆ
        resultMessage = `ขออภัยค่ะ ไม่สามารถสรุปกิจกรรมที่เหมาะสมได้ชัดเจน ลองตอบคำถามอีกครั้งนะคะ หรือคุณอาจเป็นคนที่มีความสนใจหลากหลายมากจนเกินไป!`;
    } else if (preferredHobbyList.length === 1) {
        const preferredHobby = preferredHobbyList[0];
        resultMessage = `จากการตอบคำถามของคุณ กิจกรรมยามว่างที่เหมาะกับคุณมากที่สุดคือ **${preferredHobby}** ค่ะ!`;
    } else if (preferredHobbyList.length > 1) {
        const preferredHobby = preferredHobbyList.join(' และ ');
        resultMessage = `ดูเหมือนว่ากิจกรรมยามว่างที่เหมาะกับคุณมีหลากหลาย ได้แก่ **${preferredHobby}** ลองสำรวจดูนะคะ!`;
    } 

    document.getElementById('result').innerHTML = resultMessage;
});