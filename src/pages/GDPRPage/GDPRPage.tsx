import React from "react";

import { SectionHeader, Typography } from "components";

import "./GDPRPage.css";

const GDPRPage = () => (
  <main className="container mx-auto mt-8 xl:mt-12">
    <SectionHeader title="Zásady ochrany osobných údajov" />
    <p>
      Osobné údaje spracúvame v súlade s Nariadením Európskeho parlamentu a rady
      č. 2016/679 o ochrane fyzických osôb pri spracúvaní osobných údajov
      a o voľnom pohybe takýchto údajov (ďalej len „GDPR“) a zákonom č. 18/2018
      Z. z. o ochrane osobných údajov (ďalej len „zákon o OOU“). Bezpečnosť
      osobných údajov a ich spracúvanie zákonným spôsobom je pre nás prvoradé.
      Tu sa dozviete, ako vaše osobné údaje spracúvame a ako dosiahneme ich
      bezpečnosť.
    </p>
    <section>
      <Typography
        className="text-center mt-4"
        type="subtitle"
        fontWeight="bold"
      >
        I. NAŠE ÚDAJE{" "}
      </Typography>
      <ol>
        <li>
          <div className="flex flex-col">
            Osobné údaje spracúva
            <span>
              Meno príspevkovej organizácie:{" "}
              <strong>
                Správa telovýchovných a rekreačných zariadení hlavného mesta
                Slovenskej republiky Bratislavy (ďalej len ,,STARZ“)
              </strong>
            </span>
            <span>Sídlo: Junácka 4, 831 04 Bratislava</span>
            <span>IČO: 00 179 663</span>
            <span>Zast.: Ladislav Križan, PhD., riaditeľ</span>
            <span>Email: starz@starz.sk</span>
            <span>Tel.: +42(2) 443 373 27</span>
            (ďalej len &quot;prevádzkovateľ&quot;).
          </div>
        </li>
      </ol>
    </section>
    <section>
      <Typography
        className="text-center mt-4"
        type="subtitle"
        fontWeight="bold"
      >
        II. KATEGÓRIE OSOBNÝCH ÚDAJOV, ÚČEL, PRÁVNY ZÁKLAD A OBDOBIE
      </Typography>
      <ol>
        <li>
          <span className="font-bold">
            Aké osobné údaje spracúvame, na aký účel, na akom právnom základe a
            na aké obdobie?
          </span>
          <p>
            Spracúvame len tie osobné údaje, ktoré nevyhnutne potrebujeme na
            dosiahnutie stanoveného účelu. Osobné údaje spracúvame na tieto
            účely:
          </p>
          <ol>
            <li>
              <span className="font-bold">Agenda zmluvných vzťahov</span>
              <p>
                Osobné údaje účastníkov zmluvy (FO/štatutárny orgán PO,
                zodpovedná osoba, kontaktná osoba), zástupcov vo veciach
                zmlúv/technických a iných osôb oprávnených konať v mene
                účastníka zmluvy spracúvame v rozsahu bežných osobných údajov,
                kt. sú najmä: identifikačné údaje zmluvných partnerov, iné údaje
                vyplývajúce zo zmluvy. Osobné údaje dotknutých osôb spracúvame
                na účely predzmluvných vzťahov, plnenia zmluvy, resp.
                uplatňovania nárokov zo zmluvy. Právnym základom na spracúvanie
                osobných údajov je plnenie zmluvných povinností. Účtovné doklady
                uchovávame 10 rokov.
              </p>
            </li>
            <li>
              <span className="font-bold">
                Online predaj vstupeniek do prevádzky
              </span>
              <p>
                Osobné údaje návštevníkov športovo rekreačných areálov
                prevádzkovateľa, ktorí si zakúpili vstupenky do týchto prevádzok
                prostredníctvom online systému, spracúvame v rozsahu{" "}
                <span className="text-lg">bežných osobných údajov</span>, kt. sú
                najmä: identifikačné údaje; meno, priezvisko, e-mail, číslo
                bankového účtu, platobné údaje, vek, PSČ, iné údaje potrebné pre
                vybavenie online predaja vstupeniek.V prípade zakúpenia
                permanentky, dotknutá osoba nahrá do online systému svoju
                fotografiu, ktorá bude pri vstupe do športovo rekreačného areálu
                slúžiť zamestnancovi vrátnice ako overovací identifikátor,
                priraďujúci návštevníka k zakúpenej permanentke. Osobné údaje
                dotknutých osôb spracúvame na právnom základe plnenia zmluvnej
                povinnosti. Osobné údaje uchovávame po dobu vyčerpania vstupov a
                následne ich anonymizujeme a používame v anonymizovanej forme na
                štatistické účely.
              </p>
            </li>
            <li>
              <span className="font-bold">Kontrola vstupu</span>
              <p>
                Pri vstupe návštevníkov športovo rekreačných areálov
                prevádzkovateľa, ktorí sa preukazujú online kúpenou vstupenkou,
                kontrolujeme údaje uvedené na vstupenke. Keďže vstupenka je
                neprenosná, môžeme nahliadnuť aj do vášho dokladu totožnosti,
                aby sme overili vašu identitu. Tieto osobné údaje neuchovávame.{" "}
              </p>
            </li>
            <li>
              <span className="font-bold">Účtovná agenda</span>
              <p>
                Osobné údaje zamestnancov, dodávateľov, ich kontaktných osôb
                a iných osôb vedených v účtovných dokladoch spracúvame v rozsahu
                bežných osobných údajov, kt. sú najmä: identifikačné údaje a iné
                údaje potrebné pre si povinností vyplývajúcich zo zákona
                o účtovníctve a iných relevantných právnych predpisov. Osobné
                údaje uchovávame 10 rokov nasledujúcich po roku, ktorého sa
                doklady týkajú.{" "}
              </p>
            </li>
            <li>
              <span className="font-bold">Kamerový systém</span>
              <p>
                Vaše osobné údaje v rozsahu obrazového záznamu spracúvame so
                zámerom monitorovať priestory prevádzkovateľa. Právnym základom
                na spracúvanie osobných údajov je náš oprávnený záujem, ktorým
                je ochrana majetku a bezpečnosti. Kamerový záznam uchovávame 14
                dní, resp. na dobu nevyhnutnú z dôvodu trestného, iného konania
              </p>
            </li>
          </ol>
        </li>
        <li>
          <span className="font-bold">Komu vaše údaje poskytujeme?</span>
          <p>
            Osobné údaje poskytujeme tretej osobe, len ak nám to vyplýva
            z osobitného zákona alebo je to nevyhnutné na plnenie zmluvy. Ide
            najmä o dopravcov, či orgány verejnej správy a iné oprávnené
            subjekty. Vaše osobné údaje ďalej poskytujeme sprostredkovateľom,
            ktorí nám dodávajú odborné a špecializované služby. S každým
            sprostredkovateľom sme uzatvorili zmluvu o spracúvaní osobných
            údajov a zaviazali ich mlčanlivosťou. Spracúvaním osobných údajov
            sme poverili:
          </p>
          <ol style={{ listStyle: "disc" }}>
            <li>
              poskytovateľa služieb technickej podpory pri spravovaní online
              systému a predaja Magistrát Hlavného mesta SR Bratislavy.
            </li>
          </ol>
        </li>
        <li>
          <span className="font-bold">Kam prenášame vaše osobné údaje?</span>
          <p>Vaše osobné údaje neprenášame do žiadnej tretej krajiny. </p>
        </li>
        <li>
          <span className="font-bold">Nie ste spokojný?</span>
          <p className="flex flex-col">
            Ak nie ste spokojný s tým, ako spracúvame vaše osobné údaje, môžete
            nám dať o tom vedieť na starz@starz.sk. Tiež máte možnosť podať
            sťažnosť na Úrad na ochranu osobných údajov, ak si myslíte, že vaše
            osobné údaje spracúvame nezákonne.
            <span>Úrad na ochranu osobných údajov</span>
            <span>Hraničná 12, 820 07 Bratislava</span>
            <span>Email: statny.dozor@pdp.gov.sk</span>{" "}
          </p>
        </li>
        <li>
          <span className="font-bold">Ako spracúvame vaše osobné údaje?</span>
          <p>
            Osobné údaje spracúvame v elektronickej a listinnej forme.
            Nevyužívame žiadne prostriedky automatizovaného individuálneho
            rozhodovania.{" "}
          </p>
        </li>
        <li>
          <span className="font-bold">
            Ako zabezpečíme ochranu vašich osobných údajov?
          </span>
          <p>
            Bezpečnosť vašich osobných údajov je pre nás prvoradá. Aby sme
            zabezpečili ochranu vašich osobných údajov, prijali sme potrebné
            technické a organizačné opatrenia. Web stránka je zabezpečená pred
            prístupom tretích osôb SSL certifikátom. Osoby, ktoré spracúvajú
            osobné údaje boli poučené a zaviazané mlčanlivosťou.
          </p>
        </li>
        <li>
          <span className="font-bold">Aké máte práva?</span>
          <ol>
            <li>
              <span className="font-bold">Právo na prístup k údajom</span>
              <p>
                Máte právo vedieť, či spracúvame vaše osobné údaje. Pokiaľ tieto
                spracúvame, môžete nás požiadať o prístup k údajom. Na základe
                vašej žiadosti vydáme potvrdenie s informáciami o spracúvaní
                vašich osobných údajov našou spoločnosťou.{" "}
              </p>
            </li>
            <li>
              <span className="font-bold">Právo na opravu</span>
              <p>
                Máte právo na to, aby vaše osobné údaje, ktoré spracúvame, boli
                správne, úplné a aktuálne. Pokiaľ sú vaše osobné údaje nesprávne
                alebo neaktuálne, môžete nás požiadať o opravu alebo doplnenie.
              </p>
            </li>
            <li>
              <span className="font-bold">Právo na vymazanie</span>
              <p>
                Za určitých okolností máte právo, aby sme vaše osobné údaje
                vymazali. O vymazanie vašich údajov nás môžete požiadať
                kedykoľvek. Vaše osobné údaje vymažeme, ak
              </p>
              <ol>
                <li>
                  už vaše osobné údaje nepotrebujeme pre účel, na ktorý ste nám
                  ich poskytli;
                </li>
                <li>odvoláte svoj súhlas;</li>
                <li>namietate voči spracúvaniu vašich osobných údajov;</li>
                <li>spracúvame vaše osobné údaje nezákonne;</li>
                <li>
                  osobné údaje musia byť vymazané, aby sa tým splnila zákonná
                  povinnosť;
                </li>
                <li>
                  ak ste dieťa, príp. rodič dieťaťa, ktoré súhlasilo so
                  spracúvaním osobných údajov cez internet;
                </li>
              </ol>
            </li>
            <li>
              <span className="font-bold">Právo na obmedzenie spracúvania</span>
              <p>
                Môžete nás požiadať, aby sme obmedzili spracúvanie vašich
                osobných údajov. Pokiaľ vašej žiadosti vyhovieme, vaše osobné
                údaje budeme iba uchovávať a ďalej s nimi pracovať nebudeme.
                K obmedzeniu spracúvania vašich údajov dôjde, ak
              </p>
              <ol>
                <li>
                  nám oznámite, že vaše osobné údaje sú nesprávne, a to až dokým
                  neoveríme ich správnosť;
                </li>
                <li>
                  spracúvame vaše osobné údaje nezákonne, avšak vy nesúhlasíte
                  s ich vymazaním a na miesto toho žiadate, aby sme spracúvanie
                  vašich osobných údajov len obmedzili;
                </li>
                <li>
                  vaše údaje už nepotrebujeme, ale potrebujete ich vy na
                  preukázanie, uplatňovanie alebo obhajovanie svojich práv;
                </li>
                <li>
                  namietate voči spracúvaniu vašich osobných údajov, a to až kým
                  neoveríme, či naše oprávnené záujmy prevažujú nad vašimi
                  dôvodmi.
                </li>
              </ol>
            </li>
            <li>
              <span className="font-bold">Právo na prenosnosť údajov</span>
              <p>
                Máte právo žiadať, aby sme vám poskytli vaše osobné údaje v
                elektronickej forme (napr. súbor XML alebo CSV), ktorá vám
                umožní ľahko si preniesť údaje do inej spoločnosti. Tiež nás
                môžete požiadať, aby sme vaše osobné údaje preniesli vybranej
                spoločnosti priamo my. Vašej žiadosti vyhovieme v prípade, že
                ste nám poskytli osobné údaje priamo vy a dali ste nám na ich
                spracúvanie súhlas.{" "}
              </p>
            </li>
            <li>
              <span className="font-bold">Právo namietať</span>
              <p>
                Máte právo namietať, že spracúvame vaše osobné údaje. Ak vaše
                osobné údaje spracúvame na účely priameho marketingu, môžete
                namietať ich spracúvanie kedykoľvek. Na základe námietky vaše
                osobné údaje vymažeme. Ak vaše osobné údaje spracúvame v
                nasledovných prípadoch:
              </p>
              <ol>
                <li>
                  na plnenie úlohy vo verejnom záujme alebo pri výkone verejnej
                  moci,
                </li>
                <li>z dôvodu nášho oprávneného záujmu,</li>
                <li>vytvárania profilu žiaka,</li>
              </ol>
              <p>
                môžete namietať ich spracúvanie, ak máte na to osobné dôvody.
              </p>
            </li>
          </ol>
        </li>
        <li>
          <span className="font-bold">Ako môžete tieto práva vykonávať?</span>
          <p>
            S vašou žiadosťou sa môžete na nás obrátiť niektorým z týchto
            spôsobov:
            <ol>
              <li>zaslaním oznámenia na starz@starz.sk,</li>
              <li>
                zaslaním oznámenia poštou na adresu: Junácka 4, 831 04
                Bratislava
              </li>
            </ol>
            Všetkými vašimi žiadosťami sa budeme zaoberať a o výsledku jej
            vybavenia vás budeme informovať rovnakým spôsobom, ako žiadosť
            podáte.
          </p>
        </li>
        <li>
          <span className="font-bold">Záverečné ustanovenia</span>
          <p>
            Tieto zásady ochrany osobných údajov nadobúdajú platnosť dňa
            07.05.2021. Vyhradzujeme si právo tieto zásady zmeniť, ak dôjde
            k zmene spracúvania osobných údajov v našej organizácii.
          </p>
        </li>
      </ol>
    </section>
  </main>
);

export default GDPRPage;
