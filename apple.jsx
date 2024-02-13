import React, { useState, useEffect, useRef } from "react";
import "./Apple.css";
import { Button, Row, Col } from "reactstrap";
let q = 0;
const Apple = () => {
  let ara = [];
  let poleBodu = [];
  let max;

  let hodnotyTlacitek = [];
  const [lada, setLada] = useState([]); // pole do ktereho se generuji pozice jablek
  const [obrMax, setObrMax] = useState(); // maximum jablek na obrazovku
  const [ok, setOk] = useState(0); //správné odpovědi
  const [bad, setBad] = useState(0); // špatné odpovědi
  const [showButton, setShowButton] = useState(false);
  const [tlacitka, setTlacitka] = useState([]);
  const [end, setEnd] = useState();
  const [hide, setHide] = useState(false);
  const [smile, setSmile] = useState();
  const [userMax, setUserMax] = useState(10); // uživatelsky definovane maximum obrazku
  const [showStart, setShowStart] = useState(true);
  const myDivRef = useRef(null);

  // Rendrování obrázku do mřížky na určenou pozici
  const Point = ({ x, y }) => (
    <span style={{ position: "absolute", left: `${x}px`, top: `${y}px` }}>
      <img
        className={`obrazek ${hide ? "none" : ""}`}
        src="./images/jablko.jpg"
        alt="Jablko"
      />
    </span>
  );
  // vytvoreni mrizky na zaklade velikosti obrazovky
  const mrizka = (sirka, vyska) => {
    let offset = (sirka - Math.floor(sirka / 60) * 60) / 2;
    for (let i = 0; i < vyska; i += 60) {
      for (let j = offset; j < sirka - 59; j += 60) {
        poleBodu.push({ i, j });
      }
    }
    // vypocet maximalniho poctu bunek na obrazovku
    sirka = Math.floor(sirka / 60);
    vyska = Math.floor(vyska / 60);
    max = sirka * vyska;
    max = Math.floor(max / 10) * 10;
    setObrMax(max);
  };
  // Rozdání jablek na hrací plochu
  const novaHra = (mmm) => {
    setShowStart(false);
    setShowButton(true);
    if (mmm) {
      ara = [];
      setLada(ara);
      let rnd;
      let random = Math.floor(Math.random() * mmm + 1);
      for (let index = 0; index < random; index++) {
        do {
          rnd = Math.floor(Math.random() * max);
        } while (ara.includes(poleBodu[rnd]));
        ara.push(poleBodu[rnd]);
        setLada(ara);
      }
      odpovedi(ara.length);
    }
  };
  // tvorba odpovědí (čísel do tlačítek)
  const odpovedi = (value) => {
    hodnotyTlacitek = [];
    setTlacitka(hodnotyTlacitek);
    hodnotyTlacitek[0] = value;
    for (let i = 1; i < 4; i++) {
      let vysledek = 0;
      do {
        let rnd = Math.round(Math.random() * 6);
        if (rnd % 2 !== 0) {
          vysledek = value - rnd;
        } else {
          vysledek = value + rnd;
        }
        if (vysledek < 0) {
          vysledek = vysledek * -1;
        }
      } while (hodnotyTlacitek.includes(vysledek) || vysledek === 0); // zajisteni neopakovatelnosti cisel a pripadne i nuly
      hodnotyTlacitek.push(vysledek);
    }
    //srovnani pole podle velikosti a pripadne otoceni, aby odpovedi nebyly porad stejne
    hodnotyTlacitek.sort((a, b) => a - b);
    q++;
    if (q % 2 === 0) {
      hodnotyTlacitek.reverse();
    }
    setTlacitka(hodnotyTlacitek);
  };
  //Porovnávání tlačítek odpovědí a skutečným počtem jablek
  const porovnani = (answ) => {
    if (answ == lada.length) {
      setOk(ok + 1);
    } else {
      setBad(bad + 1);
    }
    novaHra(userMax);
  };
  // ukonceni hry a vyhodnoceni dle %
  const konec = () => {
    let end = ok + bad;
    if (ok !== 0) {
      end = (ok / end) * 100;
      end = Math.round(end);
      setEnd(end);
      setHide(true);
      if (end === 100) {
        setSmile(1);
      } else if (end <= 99 && end >= 90) {
        setSmile(2);
      } else if (end <= 89 && end >= 65) {
        setSmile(3);
      } else {
        setSmile(4);
      }
    } else {
      setEnd(1);
      setHide(true);
      setSmile(4);
    }
    setShowButton(false);
    setShowStart(false);
  };
  const handleReset = () => {
    window.location.reload();
  };
  useEffect(() => {
    if (myDivRef.current) {
      let width = myDivRef.current.offsetWidth;
      let height = myDivRef.current.offsetHeight;
      mrizka(width, height);
    }
  });

  return (
    <div>
      <div ref={myDivRef} className="plocha">
        {lada.map((neco, index) => (
          <Point key={index} x={neco.j} y={neco.i} />
        ))}
        {end && (
          <div className="emoji" onDoubleClick={handleReset}>
            <p className="text-center">(dvojklikem na smajlíka pokračujte)</p>
            <img
              className={smile === 1 ? "visible" : "none"}
              src="./images/love1.png"
            ></img>
            <img
              className={smile === 2 ? "visible" : "none"}
              src="./images/happy2.png"
            ></img>
            <img
              className={smile === 3 ? "visible" : "none"}
              src="./images/hmm3.png"
            ></img>
            <img
              className={smile === 4 ? "visible" : "none"}
              src="./images/sad4.png"
            ></img>
            <p className="color-green">Správně: {ok}</p>
            <p className="color-red">Špatně: {bad}</p>
          </div>
        )}
        {showStart && (
          <div className={`apple-start`}>
            <p className="text-center">
              Maximálně může být zobrazeno {obrMax} jablíček
            </p>
            <div>
              <h2 className="text-center red-border">{userMax}</h2>
              <Row>
                <Col xs={6}>
                  <Button
                    block
                    disabled={userMax === 10}
                    onClick={() => setUserMax(userMax - 10)}
                  >
                    -
                  </Button>
                </Col>
                <Col xs={6}>
                  <Button
                    block
                    disabled={userMax >= obrMax}
                    onClick={() => setUserMax(userMax + 10)}
                  >
                    +
                  </Button>
                </Col>
              </Row>
              <br />
              <Row>
                <Col>
                  <Button
                    color="success"
                    block
                    onClick={() => novaHra(userMax)}
                  >
                    Nová hra
                  </Button>
                </Col>
              </Row>
            </div>
          </div>
        )}
      </div>

      {showButton && (
        <Row>
          <Col>
            <p className="color-green">Správně {ok}</p>
          </Col>

          <Col>
            <p className="color-red">špatně {bad}</p>
          </Col>
        </Row>
      )}
      <Row className={showButton ? "" : "none"}>
        {tlacitka.map((xxx) => (
          <Col>
            <Button value={xxx} onClick={() => porovnani(xxx)} block>
              {xxx}
            </Button>
          </Col>
        ))}
      </Row>
      {showButton && (
        <Row>
          <Col xs={4}></Col>
          <Col xs={4}>
            <Button
              color="danger"
              className="margin-top-20"
              block
              onClick={konec}
            >
              Konec
            </Button>
          </Col>
          <Col xs={4}></Col>
        </Row>
      )}
    </div>
  );
};

export default Apple;
