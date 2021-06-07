import React from "react";

import { SectionHeader, Typography } from "components";

import "./VOPPage.css";

const VOPPage = () => {
  return (
    <main className="mx-auto mt-8 xl:mt-12 container">
      <SectionHeader title="Všeobecné obchodné podmienky" />
      <section>
        <Typography type="subtitle" fontWeight="bold" className="text-center">
          I. Základné ustanovenia
        </Typography>
        <ol>
          <li>
            <div className="flex flex-col">
              Tieto všeobecné obchodné podmienky (ďalej len „VOP“) sú vydané:
              Správou telovýchovných a rekreačných zariadení hlavného mesta
              Slovenskej republiky Bratislavy, príspevkovou organizáciou
              zriadenou hlavným mestom SR Bratislavou na základe zriaďovacej
              listiny zo dňa 16.11.2006
              <span>IČO: 00 179 663</span>
              <span>DIČ: 2020801695</span>
              <span>so sídlom: Junácka 4, 831 04 Bratislava</span>
              <span>email: kupaliska@bratislava.sk</span>
              <span>telefón +421 2 443 733 27</span>
              <span>www.starz.sk</span>
              <span className="mt-8">(ďalej len „predávajúci“)</span>
            </div>
          </li>
          <li>
            VOP upravujú vzájomné práva a povinnosti pri kúpe online vstupenky
            na prevádzky v správe predávajúceho (ďalej len “vstupenka”) a to
            medzi predávajúcim a fyzickou osobou (ďalej len „kupujúci“)
            prostredníctvom rozhrania umiestneného na webovej stránke dostupného
            na internetové adrese: http://kupaliska.bratislava.sk/ (ďalej je
            „internetový obchod“).
          </li>
          <li>Ustanovenia VOP sú neoddeliteľnou súčasťou kúpnej zmluvy.</li>
          <li>VOP a kúpna zmluva sa uzatvárajú v slovenskom jazyku.</li>
        </ol>
      </section>
      <section>
        <Typography type="subtitle" fontWeight="bold" className="text-center">
          II. Informácie o vstupenkách
        </Typography>
        <ol>
          <li>
            Cena lístka je jednotná pre všetky vekové skupiny. Na lístky nie je
            možné uplatniť študentské ani seniorské zľavy.
          </li>
          <li>
            Online formou je možné kúpiť nasledujúce typy lístkov – celodenný
            lístok, permanentku na 10 vstupov, permanentku na 10 vstupov po
            17:00 a sezónnu permanentku.
          </li>
          <li>
            Všetky lístky a permanentky je možné využiť v ktorýkoľvek deň na
            akomkoľvek zo letných kúpalisk – Tehelné Pole, Delfín, Rosnička,
            Krasňany, Lamač, Zlaté Piesky, Rača.
          </li>
          <li>
            V prípade kúpy viacerých celodenných lístkov je možné pri jednom
            vstupe použiť pri vstupe lístok aj pre inú osobu, akým je kupujúci
            lístku (t.j. jeden kupujúci môže kúpiť a použiť lístky aj pre
            svojich kamarátov / rodinných príslušníkov / doprovod.).
          </li>
          <li>
            V prípade kúpy viacerých permanentiek na 10 vstupov, resp.
            permanentiek na 10 vstupov po 17:00 sú tieto vstupy viazané na osobu
            kupujúceho, t.j. vstupy z permanentky nie je možné využiť pre inú
            osobu.{" "}
          </li>
          <li>
            Permanentku na 10 vstupov po 17:00 je možné využiť iba pri vstupe na
            kúpalisko po 17:00.{" "}
          </li>
          <li>
            Sezónna permanentka je platná na neobmedzený počet vstupov počas
            jednej sezóny.
          </li>
          <li>
            Pri sezónnej permanentke je možné zakúpiť iba 1ks na osobu na
            sezónu.
          </li>
          <li>
            K sezónnej permanentke je možné dokúpiť aj sezónnu permanentku pre
            deti vo veku 3-18 rokov (max. 5 detí) za zvýhodnenú cenu 1€ za dieťa
            za sezónu.
          </li>
          <li>
            Dieťa do 10 rokov je povinné navštevovať letné kúpaliská v sprievode
            dospelej osoby. V prípade, že je dieťa držiteľom zvýhodnenej
            sezónnej permanentky nie je povinné ísť na kúpalisko iba v sprievode
            dospelej osoby, ku ktorého sezónnej permanentke bola detská sezónna
            permanentka zakúpená.{" "}
          </li>
          <li>
            Ak je držiteľom zvýhodnenej detskej permanentky dieťa vo veku 10 až
            18 rokov, môže využívať túto permanentku aj samostatne pri návšteve
            bez dospelej osoby
          </li>
          <li>
            Lístky a permanentky je možné využiť iba počas letnej sezóny, lístky
            a permanentky sú neprenosné do ďalšej sezóny.
          </li>
          <li>
            Pri kúpe permanentky na 10 vstupov, permanentky na 10 vstupov po
            17:00 a sezónnej permanentky je potrebné nahrať fotografiu
            kupujúceho. Fotografia slúži na ľahšiu identifikáciu pri vstupe na
            kúpalisko a zabránenie zneužívania permanentiek.
          </li>
        </ol>
      </section>
      <section>
        <Typography type="subtitle" fontWeight="bold" className="text-center">
          III. Informácie o cenách
        </Typography>
        <ol>
          <li>
            Kúpna cena vstupenky je konečná a zahŕňa všetky prípadné súvisiace
            poplatky.
          </li>
          <li>
            Výslednú cenu vybraných vstupeniek je možné uhradiť prostredníctvom
            platobného terminálu spoločnosti GLOBAL PAYMENTS (platba cez
            virtuálny terminál). Platbu je možné realizovať platobnou kartou
            VISA alebo MASTERCARD, alebo prostredníctvom GooglePay.
          </li>
          <li>
            V prípade platby prostredníctvom platobnej brány postupuje kupujúci
            podľa pokynov príslušného poskytovateľa elektronických platieb.
          </li>
          <li>
            Ceny vstupenky/vstupeniek zostávajú v platnosti po dobu, po ktorú sú
            zobrazované v internetovom obchode.
          </li>
        </ol>
      </section>
      <section>
        <Typography type="subtitle" fontWeight="bold" className="text-center">
          IV. Objednávka a uzavretie kúpnej zmluvy
        </Typography>
        <ol>
          <li>
            Náklady vzniknuté kupujúcemu pri použití komunikačných prostriedkov
            na diaľku v súvislosti s uzavretím kúpnej zmluvy (náklady na
            internetové pripojenie, náklady na telefónne hovory), hradí kupujúci
            sám.
          </li>
          <li>
            Kupujúci vykonáva objednávku vstupenky/vstupeniek vyplnením
            objednávkového formulára bez registrácie.
          </li>
          <li>
            Pred odoslaním objednávky je kupujúcemu umožnené kontrolovať a meniť
            údaje, ktoré do objednávky vložil. Údaje uvedené v objednávke sú
            predávajúcim považované za správne. Podmienkou platnosti objednávky
            je vyplnenie všetkých povinných údajov v objednávkovom formulári a
            potvrdenie kupujúceho o tom, že sa zoznámil s VOP a podmienkami
            ochrany osobných údajov.
          </li>
          <li>
            Vstupenka/y sa doručuje/ú výhradne elektronicky a to na e-mailovú
            adresu, ktorú kupujúci v rámci objednávky zadal. Tento okamih sa
            považuje za uzavretie zmluvy.
          </li>
          <li>
            Riadne uhradenú a doručenú Vstupenku na e-mail kupujúceho, ktorá
            spĺňa parametre určené predávajúcim pre vstup na prevádzku v jeho
            správe, nie je možné po doručení na e-mail vrátiť (stornovať) a
            dožadovať sa vrátenia finančných prostriedkov.
          </li>
          <li>Všetky objednávky prijaté predávajúcim sú záväzné.</li>
          <li>
            V prípade, že došlo ku zjavnej technickej chybe na strane
            predávajúceho pri uvedení ceny vstupenky v internetovom obchode,
            alebo v priebehu objednávania, nie je predávajúci povinný dodať
            kupujúcemu vstupenku za túto celkom zjavne chybnú cenu ani v
            prípade, že kupujúcemu bolo zaslané automatické potvrdenie, resp.
            vstupenka. Predávajúci informuje kupujúceho o chybe bez zbytočného
            odkladu a zašle kupujúcemu na jeho e - mailovú adresu pozmenenú
            ponuku. Pozmenená ponuka sa považuje za nový návrh kúpnej zmluvy a
            kúpna zmluva je v takom prípade uzavretá potvrdením o prijatí
            kupujúcim na emailovú adresu predávajúceho.
          </li>
        </ol>
      </section>

      <section>
        <Typography type="subtitle" fontWeight="bold" className="text-center">
          V. Práva z vadného plnenia
        </Typography>
        <ol>
          <li>
            Predávajúci zodpovedá kupujúcemu, že Vstupenka pri prevzatí nemá
            vady a že vyhovuje požiadavkám právnych predpisov.
          </li>
          <li>
            V prípade výskytu vady (ak je doručená neúplná alebo chybná
            Vstupenka, alebo nedoručená vôbec) môže kupujúci predávajúcemu
            predložiť reklamáciu a požadovať - ak ide o vadu, ktorú je možno
            odstrániť:
            <ol>
              <li>bezplatné odstránenie vady vstupenky,</li>
              <li>výmenu vstupenky za novú.</li>
            </ol>
          </li>
          <li>
            Kupujúci si svoje právo z vadného plnenia môže uplatniť do 7 dní od
            doručenia Vstupenky na svoj e-mail.
          </li>
        </ol>
      </section>
      <section>
        <Typography type="subtitle" fontWeight="bold" className="text-center">
          VI. Doručovanie
        </Typography>
        <ol>
          <li>
            Zmluvné strany si môžu všetku písomnú korešpondenciu vzájomne
            doručovať prostredníctvom elektronickej pošty.
          </li>
          <li>
            Kupujúci doručuje predávajúcemu korešpondenciu na e-mailovú adresu
            uvedenú vo VOP. Predávajúci doručuje kupujúcemu korešpondenciu na
            e-mailovú adresu uvedenú v jeho zákazníckom účte alebo v objednávke.
          </li>
        </ol>
      </section>
      <section>
        <Typography type="subtitle" fontWeight="bold" className="text-center">
          VII. Mimosúdne riešenie sporov
        </Typography>
        <ol>
          <li>
            Spotrebiteľ má právo obrátiť sa na predávajúceho so žiadosťou o
            nápravu, ak nie je spokojný so spôsobom, ktorým predávajúci vybavil
            jeho reklamáciu alebo ak sa domnieva, že predávajúci porušil jeho
            práva. Spotrebiteľ má právo podať návrh na začatie alternatívneho
            (mimosúdneho) riešenia sporu u subjektu alternatívneho riešenia
            sporov, ak predávajúci na žiadosť podľa predchádzajúcej vety
            odpovedal zamietavo alebo na ňu neodpovedal do 30 dní odo dňa jej
            odoslania. Týmto nie je dotknutá možnosť spotrebiteľa obrátiť sa na
            súd.
          </li>
          <li>
            K mimosúdnemu riešeniu spotrebiteľských sporov z kúpnej zmluvy je
            príslušná Slovenská obchodná inšpekcia, Bratislava, IČO: 17 331 927,
            ktorú je možné za uvedeným účelom kontaktovať na adrese Slovenská
            obchodná inšpekcia, Bajkalská 21/A, P. O. BOX č. 5, 820 07
            Bratislava, Odbor medzinárodných vzťahov a alternatívneho riešenia
            sporov, alebo elektronicky na ba@soi.sk, ars@soi.sk alebo
            adr.@soi.sk. Internetová adresa: https://www.soi.sk/. Platformu pre
            riešenie sporov on-line nachádzajúcu sa na internetovej adrese
            http://ec.europa.eu/consumers/odr je možné využiť pri riešení sporov
            medzi predávajúcim a kupujúcim z kúpnej zmluvy.
          </li>
          <li>
            Európske spotrebiteľské centrum Slovenská republika, so sídlom
            Mlynské nivy 44/a, 827 15 Bratislave, internetová adresa:
            http://esc-sr.sk/ je kontaktným miestom podľa Nariadenia Európskeho
            parlamentu a Rady (EU) č. 524/2013 z 21. mája 2013 o riešení
            spotrebiteľských sporov on-line a o zmene nariadenia (ES) č.
            2006/2004 a smernice 2009/22/ES (nariadenie o riešení
            spotrebiteľských sporov on-line).
          </li>
        </ol>
      </section>
      <section>
        <Typography type="subtitle" fontWeight="bold" className="text-center">
          VIII. Záverečné ustanovenia
        </Typography>
        <ol>
          <li>
            Všetky dojednania, vrátane tých, ktoré nie sú priamo upravené vo
            VOP, medzi predávajúcim a kupujúcim sa spravujú právnym poriadkom
            Slovenskej republiky. Ak vzťah založený kúpnou zmluvou obsahuje
            medzinárodný prvok, strany sa dohodli, že vzťah sa riadi právom
            Slovenskej republiky. Týmto nie sú dotknuté práva spotrebiteľa
            vyplývajúce z všeobecne záväzných právnych predpisov.
          </li>
          <li>
            Predávajúci nie je vo vzťahu ku kupujúcemu viazaný žiadnymi kódexmi
            správania v zmysle ustanovení zákona č. 250/2007 Z.z. o ochrane
            spotrebiteľa v znení neskorších predpisov.
          </li>
          <li>
            Predávajúci nenesie zodpovednosť za chyby vzniknuté v dôsledku
            zásahu tretích osôb do internetového obchodu alebo v dôsledku jeho
            použitia v rozpore s jeho určením. Kupujúci nesmie pri využívaní
            internetového obchodu používať postupy, ktoré by mohli mať negatívny
            vplyv na jeho prevádzku a nesmie vykonávať žiadnu činnosť, ktorá by
            mohla jemu alebo tretím osobám umožniť neoprávnene zasahovať či
            neoprávnene užívať programové vybavenie alebo ďalšie súčasti
            tvoriace internetový obchod a užívať internetový obchod alebo jeho
            časti či softwarové vybavenie takým spôsobom, ktorý by bol v rozpore
            s jeho určením či účelom.
          </li>
          <li>
            Znenie VOP môže predávajúci meniť či dopĺňať. Týmto ustanovením nie
            sú dotknuté práva a povinnosti vzniknuté po dobu účinnosti
            predchádzajúceho znenia obchodných podmienok.
          </li>
          <li>
            VOP nadobúdajú platnosť dňom 06.05.2021 a účinnosť dňom 07.05.2021.
          </li>
        </ol>
      </section>
    </main>
  );
};
export default VOPPage;
