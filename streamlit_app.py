import streamlit as st
from streamlit.components.v1 import html

# Define the HTML content with the JavaScript file included
html_content = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title> Hamster Kombat CLONE Key Generator</title>
    <link rel="stylesheet" href="asset/style.css">
</head>
<body>
    <div class="container">
        <header>
            <p>Created by Aronish</p>
        </header>
        <h1>Hamster Kombat CLONE Key Generator</h1>
        <select id="keyCountSelect">
            <option value="1">1 Key</option>
            <option value="2">2 Keys</option>
            <option value="3">3 Keys</option>
            <option value="4">4 Keys</option>
        </select>
        <button id="startBtn">Start</button>
        <div id="progressContainer" class="hidden">
            <div id="progressBar"></div>
            <span id="progressText">0%</span>
        </div>
        <div id="keyContainer" class="hidden">
            <h2>Generated Keys:</h2>
            <p id="generatedKeys"></p>
        </div>
        <footer>
            <button id="creatorChannelBtn">Канал создателя в Telegram</button>
        </footer>
    </div>
    <script src="asset/script.js"></script>
</body>
</html>
"""

# Render the HTML content in Streamlit
st.components.v1.html(html_content, height=600, width=800)
