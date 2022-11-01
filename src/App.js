import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

import robo from './joinblink-blink.gif';
import mic from './microphone.png';
import pause from './pause.png';
import repeat from './repeat.png';
import speaker from './speaker.png';
import arrow from './right-arrow.png';
import './App.css';
import React, { Component } from "react";
import IconButton from '@mui/material/IconButton';
import { useSpeechSynthesis } from 'react-speech-kit';
import { Button, Card, CardActions, CardContent, Typography } from "@mui/material";
// import AlarmIcon from '@mui/icons/Alarm';
const SerpApi = require('google-search-results-nodejs');
const search = new SerpApi.GoogleSearch("5ac0f13ce17deae962f46d2bc2d833151bb0af47dfb6c3c2a3112b0746016c3e");


const Dictaphone = () => {
  const { speaking, speak, voices } = useSpeechSynthesis();
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();
  const [isListening, setIsListening] = React.useState(false);
  const [result, setResult] = React.useState({ body: "", loading: false, fetched: false, error: false });
  const [d, setD] = React.useState("");
  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }
  const play = async () => {
    setResult({...result,loading:true})
    const data = await getSearchResults(transcript);
    setResult({...result,loading:false});
    console.log("result",result["body"]);
    // search.json();
    speak({ text: data, voice: voices[7] });
  }

  const getSearchResults = async (query) => {
    // const response = await fetch(`https://www.google.com/search?q=${transcript}`);
    // const html = await response.text();
    // console.log(html);
    const params = {
      "api_key": "363305b983f7d8161f0e9c166e5056d61031d116cc6fa625806dda921ecfcd2c",
      "device": "desktop",
      "engine": "google",
      "q": query,
      "location": "Hyderabad, Telangana, India",
      "google_domain": "google.co.in",
      "gl": "in",
      "hl": "en"
    }
    var querystring = Object.keys(params).map(key => key + '=' + params[key]).join('&');
    var querystr = querystring.replace(/ /g, "+");

    console.log(querystr)
    const res = await fetch("https://serpapi.com/search.json?" + querystr, {
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',

      }
    });
    const data = await res.json();
    console.log(data);
    console.log(data["organic_results"][2]["snippet"]);
    setD(data["organic_results"][0]["snippet"]);
    setResult({...result,body:data["organic_results"][0]["snippet"]});
    return data["organic_results"][0]["snippet"];
    // search.json(params,(data)=>{
    //   console.log(data["organic_results"])
    // })

  }
  // console.log(voices);

  return (
    <div className="main">
      <div className="contain">
        <img src={robo} className="robo"></img>
        <div class={listening ? "blob" : ""}></div>
      </div>
      <div>
        <span>
          <IconButton color="secondary" aria-label="add an alarm" onClick={
            () => {
              console.log("clicked", listening);
              if (listening) {
                SpeechRecognition.stopListening();
                setIsListening(false);
              } else {
                SpeechRecognition.startListening();
                setIsListening(true);
              }
            }
          }>
            <img className="pause" src={listening ? pause : mic} ></img>
          </IconButton></span>
        <span>
          <IconButton color="secondary" aria-label="add an alarm" onClick={
            resetTranscript
          }>
            <img className="pause" src={repeat} ></img>
          </IconButton>

        </span>
        <span >

          <IconButton  color="secondary" aria-label="add an alarm" onClick={
            () => {
              if (!speaking) play();
            }
          }>
            <img className="pause" src={speaking ? speaker : arrow} ></img>
          </IconButton>

        </span>
      </div>


      <div>

        <p className="transcript">{transcript}</p>

      </div>


      {result.loading?<div  >
      <div class="dot-loader"></div>
<div class="dot-loader"></div>
<div class="dot-loader"></div>
      </div>:
        <p className="transcript" style={{fontSize:"20px"}}>{d}</p>
      
      
      }


    </div>
  );
};
export default Dictaphone;