import os
import streamlit as st
from google import genai
from pypdf import PdfReader

st.set_page_config(page_title="AI Tutor & PDF Studio", page_icon="📚", layout="wide")
st.title("📚 AI Tutor & PDF Studio")

# API Key setup
api_key = st.sidebar.text_input("Gemini API Key", type="password") or os.environ.get("GEMINI_API_KEY")

if not api_key:
    st.info("Please enter your Gemini API Key in the sidebar to get started.")
    st.stop()

client = genai.Client(api_key=api_key)

# Sidebar navigation
option = st.sidebar.radio("Choose Feature", ["AI Doubt Solver", "PDF OCR & Summary"])

if option == "AI Doubt Solver":
    st.header("💬 AI Doubt Solver")
    subject = st.selectbox("Subject", ["Computer Science", "Mathematics", "Physics", "Chemistry"])
    user_prompt = st.text_area("Ask any doubt or paste broken code:")
    
    if st.button("Solve Doubt"):
        with st.spinner("AI Tutor is analyzing..."):
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=f"You are a helpful {subject} tutor. Answer step-by-step: {user_prompt}"
            )
            st.markdown(response.text)

elif option == "PDF OCR & Summary":
    st.header("📄 PDF Document Studio")
    uploaded_file = st.file_uploader("Upload PDF textbook or notes", type=["pdf"])
    
    if uploaded_file:
        reader = PdfReader(uploaded_file)
        extracted_text = ""
        for page in reader.pages[:15]:  # read first 15 pages
            extracted_text += page.extract_text() + "\n"
        
        st.text_area("Extracted Text Preview", extracted_text[:1000] + "...", height=150)
        
        if st.button("Synthesize Study Notes"):
            with st.spinner("Generating notes summary..."):
                response = client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=f"Summarize these study notes into key concepts, formulas, and high-yield exam tips:\n\n{extracted_text[:10000]}"
                )
                st.markdown(response.text)