document.addEventListener('contextmenu', event => event.preventDefault());

// Wrap every letter in a span
var textWrapper3 = document.querySelector('.ml13');
textWrapper3.innerHTML = textWrapper3.textContent.replace(/\S/g, "<span class='letter3'>$&</span>");

anime.timeline({ loop: false })
    .add({
        targets: '.ml13 .letter3',
        translateY: [100, 0],
        translateZ: 0,
        opacity: [0, 1],
        easing: "easeOutExpo",
        duration: 1000,
        delay: (el, i) => 300 + 30 * i
    })

var userAvatar = '';
var userColor = '#FED7DA';
var userName = '';
var responses = {};
var useAI = true;
var cohereAPIKey = '4tojqOj8JlW5bKgPjr1Ju1jQDfLGszKQT3gnCz3Y';

// Portfolio context for AI
var portfolioContext = `You are Sophia, a software developer and web designer based in Canada. 
You graduated from the University of Calgary with a computer science degree.
You currently work as a C++ game engineer at a video game company.
Your skills include: JavaScript, C++, Python, React, Vue, Node.js, and game engines like Frostbite.
Your projects include: STEM data visualization, HCI research projects, and interactive UI experiments.
You can be contacted through LinkedIn, GitHub, or email.
Keep responses friendly, concise (2-3 sentences), and encouraging visitors to explore the portfolio.`;

// Load responses from JSON file as fallback
fetch('responses.json')
    .then(response => response.json())
    .then(data => {
        responses = data;
        console.log('Responses loaded:', responses);
    })
    .catch(error => {
        console.error('Error loading responses:', error);
        // Fallback responses if file fails to load
        responses = {
            "greetings": ["Hi there! Thanks for visiting!"],
            "about": ["I'm a software developer based in Canada!"],
            "projects": ["Check out my Projects section to see what I've built!"],
            "skills": ["I work with JavaScript, C++, Python, and more!"],
            "contact": ["Click the Contact button to reach me!"],
            "thanks": ["You're welcome!"],
            "positive": ["That's great!"],
            "general": ["That's interesting! Tell me more!"],
            "goodbye": ["See you later!"]
        };
    });

function getLogin() {
    var fn = document.getElementById("fname").value;
    if (!fn) {
        alert('Please enter your name!');
        return false;
    }
    
    userName = fn;
    
    // Close login container
    document.getElementById('login-container').classList.add('closeanimate');
    setTimeout(function(){
        document.getElementById('login-container').classList.remove('closeanimate');
        document.getElementById('login-container').style.display='none';
    }, 600);
    
    // Show chat container
    setTimeout(function(){
        document.getElementById('chat-container').style.display = 'flex';
        
        // Add initial message from Sophia
        addMessage('Sophia', 'Hi there! Thanks for visiting my portfolio site. Feel free to look around and ask me any questions :)', 'sophia');
    }, 700);
    
    return false;
}

function addMessage(sender, message, type) {
    var chatMessages = document.getElementById('chat-messages');
    var messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message ' + type;
    
    var avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    if (type === 'sophia') {
        avatarDiv.style.background = "url('assets/me2.png')";
        avatarDiv.style.backgroundSize = 'cover';
        avatarDiv.style.backgroundPosition = 'center';
        
        // Play notification sound for Sophia's messages
        var chatSound = new Audio('assets/chatping.mp3');
        chatSound.play();
    } else {
        avatarDiv.style.background = userAvatar;
        avatarDiv.style.backgroundRepeat = 'no-repeat';
        avatarDiv.style.backgroundPosition = 'center';
        avatarDiv.style.backgroundSize = '80%';
        avatarDiv.style.backgroundColor = userColor;
    }
    
    var contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    var nameSpan = document.createElement('span');
    nameSpan.className = 'message-name';
    nameSpan.textContent = sender;
    
    var textDiv = document.createElement('div');
    textDiv.className = 'message-text';
    textDiv.textContent = message;
    
    contentDiv.appendChild(nameSpan);
    contentDiv.appendChild(textDiv);
    
    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getResponse(category) {
    console.log('Getting response for category:', category);
    console.log('Available responses:', responses);
    
    // Check if responses are loaded and category exists
    if (responses && responses[category] && responses[category].length > 0) {
        var randomIndex = Math.floor(Math.random() * responses[category].length);
        var response = responses[category][randomIndex];
        console.log('Selected response:', response);
        return response;
    }
    // Fallback if responses aren't loaded yet
    console.log('Category not found or responses not loaded:', category);
    return "That's interesting! Tell me more!";
}

function detectCategory(message) {
    var lowerMessage = message.toLowerCase();
    
    console.log('Detecting category for message:', lowerMessage);
    
    // Keyword detection
    if (lowerMessage.match(/\b(hi|hello|hey|greetings|yo)\b/)) {
        console.log('Detected: greetings');
        return 'greetings';
    }
    if (lowerMessage.includes('about') || lowerMessage.includes('who are you') || 
        lowerMessage.includes('tell me about yourself') || lowerMessage.includes('your background')) {
        console.log('Detected: about');
        return 'about';
    }
    if (lowerMessage.includes('project') || lowerMessage.includes('work') || 
        lowerMessage.includes('portfolio') || lowerMessage.includes('built') || 
        lowerMessage.includes('made')) {
        console.log('Detected: projects');
        return 'projects';
    }
    if (lowerMessage.includes('skill') || lowerMessage.includes('technology') || 
        lowerMessage.includes('technologies') || lowerMessage.includes('what do you know') || 
        lowerMessage.includes('experience')) {
        console.log('Detected: skills');
        return 'skills';
    }
    if (lowerMessage.includes('contact') || lowerMessage.includes('email') || 
        lowerMessage.includes('reach') || lowerMessage.includes('linkedin') || 
        lowerMessage.includes('github')) {
        console.log('Detected: contact');
        return 'contact';
    }
    if (lowerMessage.match(/\b(thank|thanks|thx)\b/)) {
        console.log('Detected: thanks');
        return 'thanks';
    }
    if (lowerMessage.match(/\b(bye|goodbye|see you|later)\b/)) {
        console.log('Detected: goodbye');
        return 'goodbye';
    }
    if (lowerMessage.match(/\b(great|awesome|amazing|cool|nice|love)\b/)) {
        console.log('Detected: positive');
        return 'positive';
    }
    
    console.log('Detected: general');
    return 'general';
}

function sendMessage() {
    var input = document.getElementById('chat-input');
    var message = input.value.trim();
    
    if (message) {
        addMessage(userName, message, 'user');
        input.value = '';
        
        // Show typing indicator
        setTimeout(function() {
            if (useAI && cohereAPIKey) {
                // Use AI for response
                getAIResponse(message);
            } else {
                // Use keyword-based responses
                var category = detectCategory(message);
                var sophiaResponse = getResponse(category);
                addMessage('Sophia', sophiaResponse, 'sophia');
            }
        }, 1000);
    }
}

async function getAIResponse(userMessage) {
    console.log('Attempting AI response for:', userMessage);
    console.log('API Key exists:', !!cohereAPIKey);
    
    try {
        const response = await fetch('https://api.cohere.ai/v1/chat', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${cohereAPIKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'command-a-03-2025',
                preamble: portfolioContext + '\n\nRespond as Sophia in 2-3 friendly sentences.',
                message: userMessage
            })
        });

        console.log('API Response status:', response.status);

        if (!response.ok) {
            const errorData = await response.json();
            console.error('AI API error:', errorData);
            throw new Error(`AI API request failed: ${response.status}`);
        }

        const data = await response.json();
        console.log('AI Response data:', data);
        
        let aiResponse = data.text || "That's interesting! Tell me more!";
        
        // Clean up the response
        aiResponse = aiResponse.trim();
        
        // If response is too long, truncate
        if (aiResponse.length > 300) {
            aiResponse = aiResponse.substring(0, 297) + '...';
        }
        
        console.log('Final AI response:', aiResponse);
        addMessage('Sophia', aiResponse, 'sophia');
    } catch (error) {
        console.error('AI response error:', error);
        console.log('Falling back to keyword-based response');
        // Fallback to keyword-based response
        var category = detectCategory(userMessage);
        var sophiaResponse = getResponse(category);
        addMessage('Sophia', sophiaResponse, 'sophia');
    }
}

function clearChat() {
    // Clear all messages
    var chatMessages = document.getElementById('chat-messages');
    chatMessages.innerHTML = '';
    
    // Close chat container with animation
    document.getElementById('chat-container').classList.add('closeanimate');
    setTimeout(function(){
        document.getElementById('chat-container').classList.remove('closeanimate');
        document.getElementById('chat-container').style.display='none';
    }, 600);
    document.getElementById('main-container').style.pointerEvents='auto';
}

$("button").click(function() {
    var val = $(this).val();
    val = parseInt(val, 10);


    switch (val) {
        case 1:
            userAvatar = "url('assets/kirby.png')";
            document.getElementById("avatar").style.background = userAvatar;
            break;
        case 2:
            userAvatar = "url('assets/kingdede.gif')";
            document.getElementById("avatar").style.background = userAvatar;
            break;
        case 3:
            userAvatar = "url('assets/metaknight.gif')";
            document.getElementById("avatar").style.background = userAvatar;
            break;
        case 4:
            userAvatar = "url('assets/mario.gif')";
            document.getElementById("avatar").style.background = userAvatar;
            break;
        case 5:
            userAvatar = "url('assets/bowser.gif')";
            document.getElementById("avatar").style.background = userAvatar;
            break;
        case 6:
            userAvatar = "url('assets/daisy.gif')";
            document.getElementById("avatar").style.background = userAvatar;
            break;
        case 7:
            userAvatar = "url('assets/sonic.png')";
            document.getElementById("avatar").style.background = userAvatar;
            break;
        case 8:
            userAvatar = "url('assets/pikachu.png')";
            document.getElementById("avatar").style.background = userAvatar;
            break;
        case 9:
            userAvatar = "url('assets/gengar.png')";
            document.getElementById("avatar").style.background = userAvatar;
            break;
        case 10:
            userAvatar = "url('assets/jira.png')";
            document.getElementById("avatar").style.background = userAvatar;
            break;
        case 11:
            document.getElementById('resume-container').style.display = 'block';
            break;
        case 12:
            document.getElementById('projects-container').style.display = 'block';
            break;
        case 13:
            document.getElementById('contact-container').style.display = 'block';
            break;
        case 14:
            document.getElementById('profile-container').style.display = 'block';
            break;
        case 0:
            document.getElementById('login-container').style.display = 'block';
            break;
        default:
            document.getElementById("avatar").style.background = "url('assets/mariosmushroom.png')";
    }

    document.getElementById("avatar").style.backgroundRepeat = "no-repeat";
    document.getElementById("avatar").style.backgroundPosition = "center";
    document.getElementById("avatar").style.backgroundSize = "80%";
    document.getElementById("avatar").style.backgroundColor = "#FED7DA";


});

// Allow sending message with Enter key
document.addEventListener('DOMContentLoaded', function() {
    var chatInput = document.getElementById('chat-input');
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
});

var colorWell;
var defaultColor = "#FED7DA";

window.addEventListener("load", startup, false);

function startup() {
    colorWell = document.querySelector("#bg");
    colorWell.value = defaultColor;
    colorWell.addEventListener("input", updateFirst, false);
    colorWell.select();
}

function updateFirst(event) {
    document.getElementById("avatar").style.backgroundColor = event.target.value;
}

new Vue({
    el: "#time",
    data() {
        return {
            time: '',
            date: '',
            day: ''
        }
    },
    beforeMount() {
        setInterval(() => {
            this.time = moment().format('h:mm A')
        }, 1000)
        setInterval(() => {
            this.day = moment().format('dddd')
        }, 1000)
        setInterval(() => {
            this.date = moment().format('MMMM D')
        }, 1000)
    }
})

var audio = new Audio('assets/unlock.mp3');

$(document).ready(function() {
    $("#unlock").click(function() {
        document.getElementById('unlock-container').style.position = "relative";
        audio.play();
        unlock();
        document.getElementById("unlock-container").removeChild(document.getElementById("unlock"));
    });
});

function unlock() {
    document.getElementById('unlock-screen').style.top = "-105vh";

}

dynamicLayout();

$(window).resize(function() {
    dynamicLayout();
});

window.mobileCheck = function() {
    let check = false;
    (function(a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};

function dynamicLayout() {
    var browserWidth = $(window).width();

    console.log(browserWidth);

    // Narrow CSS rules
    if (browserWidth < 414) {
        document.getElementById("pagestyle").setAttribute("href", "mobile.css");
        document.getElementById("unlockimg").src = "assets/unlockscreenmobile.gif";
    }
    // Normal (default) CSS rules
    if (browserWidth >= 414) {
        document.getElementById("pagestyle").setAttribute("href", "style.css");
        document.getElementById("unlockimg").src = "assets/unlockscreen.gif";
    }
}