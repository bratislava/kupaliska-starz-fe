import React from 'react'

import { SectionHeader, Typography } from 'components'

import './GDPRPage.css'
import { Trans, useTranslation } from 'react-i18next'
import Markdown from 'react-markdown'
const GDPRPage = () => {
  const { t } = useTranslation()

  const gdprText = `## **Zásady ochrany osobných údajov**
Osobné údaje spracúvame v súlade s Nariadením Európskeho parlamentu a rady č. 2016/679 o ochrane fyzických osôb pri spracúvaní osobných údajov a o voľnom pohybe takýchto údajov (ďalej len „GDPR“) a zákonom č. 18/2018 Z. z. o ochrane osobných údajov (ďalej len „zákon o OOU“). Bezpečnosť osobných údajov a ich spracúvanie zákonným spôsobom je pre nás prvoradé. Tu sa dozviete, ako vaše osobné údaje spracúvame a ako dosiahneme ich bezpečnosť.

### **I. NAŠE ÚDAJE**
#### 1. Osobné údaje spracúva:

Názov príspevkovej organizácie: Správa telovýchovných a rekreačných zariadení hlavného mesta Slovenskej republiky Bratislavy (ďalej len ,,STARZ“)

Sídlo: Junácka 4, 831 04 Bratislava IČO: 00 179 663

Zast.: Ladislav Križan, PhD., riaditeľ

Email: starz@starz.sk

Tel.: +42(2) 443 373 27

(ďalej len „prevádzkovateľ“)

### **II. KATEGÓRIE OSOBNÝCH ÚDAJOV, ÚČEL, PRÁVNY ZÁKLAD A OBDOBIE**

1. **Aké osobné údaje spracúvame, na aký účel, na akom právnom základe a na aké obdobie?** Spracúvame len tie osobné údaje, ktoré nevyhnutne potrebujeme na dosiahnutie stanoveného účelu. Osobné údaje spracúvame na tieto účely:
   1. **Agenda zmluvných vzťahov**
      1. Osobné údaje účastníkov zmluvy (FO/štatutárny orgán PO, zodpovedná osoba, kontaktná osoba), zástupcov vo veciach zmlúv/technických a iných osôb oprávnených konať v mene účastníka zmluvy spracúvame v rozsahu bežných osobných údajov, kt. sú najmä: identifikačné údaje zmluvných partnerov, iné údaje vyplývajúce zo zmluvy. Osobné údaje dotknutých osôb spracúvame na účely predzmluvných vzťahov, plnenia zmluvy, resp. uplatňovania nárokov zo zmluvy. Právnym základom na spracúvanie osobných údajov je plnenie zmluvných povinností. Účtovné doklady uchovávame 10 rokov.
   2. **Online predaj vstupeniek do prevádzky**
      1. Osobné údaje návštevníkov športovo rekreačných areálov prevádzkovateľa, ktorí si zakúpili vstupenky do týchto prevádzok prostredníctvom online systému, spracúvame v rozsahu bežných osobných údajov, kt. sú najmä: identifikačné údaje; meno, priezvisko, e-mail, číslo bankového účtu, platobné údaje, dátum narodenia, PSČ, iné údaje potrebné pre vybavenie online predaja vstupeniek. V prípade zakúpenia permanentky, dotknutá osoba nahrá do online systému svoju fotografiu, ktorá bude pri vstupe do športovo rekreačného areálu slúžiť zamestnancovi vrátnice ako overovací identifikátor, priraďujúci návštevníka k zakúpenej permanentke. V prípade zakúpenia permanentky pre ŤZP osoby, pri vstupe do prevádzky kontrolujeme aj preukaz ŤZP/ŤZP-S alebo doklad totožnosti. Osobné údaje dotknutých osôb spracúvame na právnom základe plnenia zmluvnej povinnosti.
   3. **Prenos dát do ďalších sezón**
      1. Osobné údaje používateľov, ktorí si zakúpili online lístok alebo permanentku bez založenia Bratislavského konta uchovávame po dobu vyčerpania vstupov a následne ich anonymizujeme a používame v anonymizovanej forme na štatistické účely. Osobné údaje používateľov, ktorí pri nákupe využili možnosť založenia Bratislavského konta spracovávame po dobu 5 rokov za účelom poskytovania kvalitných služieb aj v nasledujúcich sezónach. Používatelia aj v nasledujúcich letných sezónach budú môcť využívať dáta (fotografie, pridané osoby), ktoré si do profilu pridali a budú mať možnosť tieto dáta kedykoľvek upraviť alebo vymazať.
   4. **Kontrola vstupu**
      1. Pri vstupe návštevníkov športovo rekreačných areálov prevádzkovateľa, ktorí sa preukazujú online kúpenou vstupenkou, kontrolujeme údaje uvedené na vstupenke. Keďže vstupenka je neprenosná, môžeme nahliadnuť aj do vášho dokladu totožnosti, aby sme overili vašu identitu. V prípade zakúpenia permanentky pre ŤZP/ŤZP-S osoby, pri vstupe do prevádzky si vyhradzujeme právo skontrolovať aj preukaz ŤZP/ŤZP-S. Tieto osobné údaje neuchovávame.
   5. **Účtovná agenda**
      1. Osobné údaje zamestnancov, dodávateľov, ich kontaktných osôb a iných osôb vedených v účtovných dokladoch spracúvame v rozsahu bežných osobných údajov, kt. sú najmä: identifikačné údaje a iné údaje potrebné pre splnenie povinností vyplývajúcich zo zákona o účtovníctve a iných relevantných právnych predpisov. Osobné údaje uchovávame 10 rokov nasledujúcich po roku, ktorého sa doklady týkajú.
   6. **Kamerový systém**
      1. Vaše osobné údaje v rozsahu obrazového záznamu spracúvame so zámerom monitorovať priestory prevádzkovateľa. Právnym základom na spracúvanie osobných údajov je náš oprávnený záujem, ktorým je ochrana majetku a bezpečnosti. Kamerový záznam uchovávame 14 dní, resp. na dobu nevyhnutnú z dôvodu trestného, iného konania.
   7. **Oprávnený záujem v zmysle čl. 6 ods. 1 písm. f) Nariadenia GDPR**
      1. Vaše osobné údaje spracúvame takisto na účely priameho marketingu. Na tento účel sú spracúvané nasledovné údaje: e-mailová adresa, krstné meno
   8. **Zber spätnej väzby v zmysle čl. 6 ods. 1 písm. f) Nariadenia GDPR**
      1. Snažíme sa neustále vylepšovať naše služby na základe spätnej väzby od používateľov, ktorí služby využívajú. Spätnú väzbu zbierame e-mailovou formou. Na účely získavania spätnej väzby spolupracujeme s hlavným mestom Slovenskej republiky Bratislavou, ktoré má postavenie sprostredkovateľa pri spracúvaní príslušných osobných údajov. Na tento účel sú spracúvané nasledovné údaje: e-mailová adresa, krstné meno, priezvisko
   9. **Komu vaše údaje poskytujeme?**
      1. Osobné údaje poskytujeme tretej osobe, len ak nám to vyplýva z osobitného zákona alebo je to nevyhnutné na plnenie zmluvy. Ide najmä o dopravcov, či orgány verejnej správy a iné oprávnené subjekty. Vaše osobné údaje ďalej poskytujeme sprostredkovateľom, ktorí nám dodávajú odborné a špecializované služby. S každým sprostredkovateľom sme uzatvorili zmluvu o spracúvaní osobných údajov a zaviazali ich mlčanlivosťou.
      1. Sprostredkovateľom osobných údajov je: 1. Hlavné mesto Slovenskej republiky Bratislava, so sídlom Primaciálne námestie č. 1, 814 99 Bratislava, IČO: 00 603 481, a to v rámci vývoja softvéru digitálnej služby, realizovania prieskumu potrieb cieľových skupín, mapovania priebežnej spokojnosti užívateľov, a teda získavania spätnej väzby a súvisiacich činností či poskytovaných služieb.
   10. **Subdodávatelia**: 
      Hlavné mesto využíva subdodávateľov pre zabezpečenie niektorých funkcionalít, potrebných pre správu a fungovanie systému. Konkrétne sa jedná o službu Mailgun, prostredníctvom ktorej je zabezpečené odosielanie emailov na zákazníka. Zber spätnej väzby realizovaný prostredníctvom služby Staffino. Analytika webu cez službu Plausible.


   Hlavné mesto môže pre svoje štatistické účely spracúvať anonymizované údaje z dotazníka spokojnosti, pričom v tomto prípade má postavenie prevádzkovateľa osobných údajov. Bližšie informácie o podmienkach spracúvania osobných údajov Hlavným mestom <https://www.bratislava.sk/ochrana-osobnych-udajov>.

2. **Kam prenášame vaše osobné údaje?**
  Vaše osobné údaje neprenášame do žiadnej tretej krajiny.
3. **Nie ste spokojný?**
  Ak nie ste spokojný s tým, ako spracúvame vaše osobné údaje, môžete nám dať o tom vedieť na starz@starz.sk. Tiež máte možnosť podať sťažnosť na Úrad na ochranu osobných údajov, ak si myslíte, že vaše osobné údaje spracúvame nezákonne. Úrad na ochranu osobných údajovHraničná 12, 820 07 Bratislava Email: statny.dozor@pdp.gov.sk
4. **Ako spracúvame vaše osobné údaje?**
  Osobné údaje spracúvame v elektronickej a listinnej forme. Nevyužívame žiadne prostriedky automatizovaného individuálneho rozhodovania.
5. **Ako zabezpečíme ochranu vašich osobných údajov?**
  Bezpečnosť vašich osobných údajov je pre nás prvoradá. Aby sme zabezpečili ochranu vašich osobných údajov, prijali sme potrebné technické a organizačné opatrenia. Web stránka je zabezpečená pred prístupom tretích osôb SSL certifikátom. Osoby, ktoré spracúvajú osobné údaje boli poučené a zaviazané mlčanlivosťou.
6. **Aké máte práva?**
   1. **Právo na prístup k údajom**
    Máte právo vedieť, či spracúvame vaše osobné údaje. Pokiaľ tieto spracúvame, môžete nás požiadať o prístup k údajom. Na základe vašej žiadosti vydáme potvrdenie s informáciami o spracúvaní vašich osobných údajov našou spoločnosťou.
   2. **Právo na opravu**
    Máte právo na to, aby vaše osobné údaje, ktoré spracúvame, boli správne, úplné a aktuálne. Pokiaľ sú vaše osobné údaje nesprávne alebo neaktuálne, môžete nás požiadať o opravu alebo doplnenie.
   3. **Právo na vymazanie** 
    Za určitých okolností máte právo, aby sme vaše osobné údaje vymazali. O vymazanie vašich údajov nás môžete požiadať kedykoľvek. Vaše osobné údaje vymažeme, ak
      1. už vaše osobné údaje nepotrebujeme pre účel, na ktorý ste nám ich poskytli;
      2. odvoláte svoj súhlas;
      3. namietate voči spracúvaniu vašich osobných údajov;
      4. spracúvame vaše osobné údaje nezákonne;
      5. osobné údaje musia byť vymazané, aby sa tým splnila zákonná povinnosť;
      6. ak ste dieťa, príp. rodič dieťaťa, ktoré súhlasilo so spracúvaním osobných údajov cez internet;
   4. **Právo na obmedzenie spracúvania** 
    Môžete nás požiadať, aby sme obmedzili spracúvanie vašich osobných údajov. Pokiaľ vašej žiadosti vyhovieme, vaše osobné údaje budeme iba uchovávať a ďalej s nimi pracovať nebudeme. K obmedzeniu spracúvania vašich údajov dôjde, ak
      1. nám oznámite, že vaše osobné údaje sú nesprávne, a to až dokým neoveríme ich správnosť;
      2. spracúvame vaše osobné údaje nezákonne, avšak vy nesúhlasíte s ich vymazaním a na miesto tohto žiadate, aby sme spracúvanie vašich osobných údajov len obmedzili;
      3. vaše údaje už nepotrebujeme, ale potrebujete ich vy na preukázanie, uplatňovanie alebo obhajovanie svojich práv;
      4. namietate voči spracúvaniu vašich osobných údajov, a to až kým neoveríme, či naše oprávnené záujmy prevažujú nad vašimi dôvodmi.
   5. **Právo na prenosnosť údajov**
    Máte právo žiadať, aby sme vám poskytli vaše osobné údaje v elektronickej forme (napr. súbor XML alebo CSV), ktorá vám umožní ľahko si preniesť údaje do inej spoločnosti. Tiež nás môžete požiadať, aby sme vaše osobné údaje preniesli vybranej spoločnosti priamo my. Vašej žiadosti vyhovieme v prípade, že ste nám poskytli osobné údaje priamo vy a dali ste nám na ich spracúvanie súhlas.
   6. **Právo namietať**
    Máte právo namietať, že spracúvame vaše osobné údaje. Ak vaše osobné údaje spracúvame na účely priameho marketingu, môžete namietať ich spracúvanie kedykoľvek. Na základe námietky vaše osobné údaje vymažeme. Ak vaše osobné údaje spracúvame v nasledovných prípadoch:
      1. na plnenie úlohy vo verejnom záujme alebo pri výkone verejnej moci,
      2. z dôvodu nášho oprávneného záujmu,
      3. vytvárania profilu žiaka,
   7. môžete namietať ich spracúvanie, ak máte na to osobné dôvody.
7. **Ako môžete tieto práva vykonávať?**
  S vašou žiadosťou sa môžete na nás obrátiť niektorým z týchto spôsobov:
   1. zaslaním oznámenia na starz@starz.sk,
   2. zaslaním oznámenia poštou na adresu: Junácka 4, 831 04 Bratislava
8. Všetkými vašimi žiadosťami sa budeme zaoberať a o výsledku jej vybavenia vás budeme informovať rovnakým spôsobom, ako žiadosť podáte.
9. **Záverečné ustanovenia**
  Tieto zásady ochrany osobných údajov nadobúdajú platnosť dňa 31.05.2025. Vyhradzujeme si právo tieto zásady zmeniť, ak dôjde k zmene spracúvania osobných údajov v našej organizácii.`

  return (
    <main className="container mx-auto mt-8 xl:mt-12">
      <SectionHeader title={t('gdpr.title')} />
      {/* <Trans
        i18nKey={`gdpr.main-text`}
        components={{
          p: <p />,
          span: <span />,
          li: <li />,
          ol: <ol />,
          Typography: <Typography type="subtitle" />,
          section: <section />,
          div: <div />,
        }}
      /> */}
      <Markdown>{gdprText}</Markdown>
    </main>
  )
}

export default GDPRPage
