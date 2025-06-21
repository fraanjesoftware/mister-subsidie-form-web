import { FormData } from '../types';

export const prepareFormData = (formData: FormData) => {
  const structuredData = {
    machtiging: {
      aanvrager: {
        naamOnderneming: formData.bedrijfsnaam,
        email: formData.email,
        kvkNummer: formData.kvkNummer
      },
      gemachtigde: {
        naamOrganisatie: 'Tim Otte/NOT-Company bv h.o.d.n. Mistersubsidie',
        email: 'Tim@mistersubsidie.nl',
        volledigeNaam: 'Tim Otte',
        telefoon: '0611241360',
        kvkNummer: '24353031'
      },
      machtigingToestemming: {
        bevoegd: formData.akkoordMachtiging,
        waarheid: formData.akkoordWaarheid
      },
      reikwijdte: {
        indienen: formData.machtigingIndienen,
        handelingen: formData.machtigingHandelingen,
        bezwaarBeroep: formData.machtigingBezwaar
      },
      ondertekening: {
        bestuurder1: {
          voorletters: formData.bestuurder1.voorletters,
          achternaam: formData.bestuurder1.achternaam,
          functie: formData.bestuurder1.functie,
          datum: formData.datum
        },
        bestuurder2: formData.bestuurder2.nodig ? {
          voorletters: formData.bestuurder2.voorletters,
          achternaam: formData.bestuurder2.achternaam,
          functie: formData.bestuurder2.functie,
          datum: formData.datum
        } : {}
      }
    },
    deMinimis: {
      verklaring: formData.deMinimisType,
      bedragDeMinimis: formData.deMinimisAmount,
      bedragAndereStaatssteun: formData.andereStaatssteunAmount,
      datumAndereStaatssteun: formData.andereStaatssteunDatum,
      bedrijfsgegevens: {
        bedrijfsnaam: formData.bedrijfsnaam,
        kvkNummer: formData.kvkNummer,
        naceClassificatie: formData.naceClassificatie,
        naamFunctionaris: formData.bestuurder1.volledigeNaam,
        functie: formData.bestuurder1.functie,
        adres: formData.adres,
        postcode: formData.postcode,
        plaats: formData.plaats,
        datum: formData.datum
      }
    },
    mkb: {
      naamOnderneming: formData.bedrijfsnaam,
      aantalFte: formData.aantalFte,
      laatsteBoekjaar: formData.laatsteBoekjaar,
      jaaromzet: formData.jaaromzet,
      balanstotaal: formData.balanstotaal,
      typeOnderneming: formData.ondernemingType,
      ondertekening: {
        naam: formData.bestuurder1.volledigeNaam,
        functie: formData.bestuurder1.functie,
        datumPlaats: `${formData.datum}, ${formData.plaats || 'Nederland'}`
      }
    }
  };
  
  // PDF Field Mapping - platte structuur voor makkelijke mapping naar PDF velden
  const pdfFieldMapping = {
    // Machtigingsformulier velden
    "mach_naam_onderneming": formData.bedrijfsnaam,
    "mach_email": formData.email,
    "mach_kvk": formData.kvkNummer,
    "mach_gem_naam": "Tim Otte/NOT-Company bv h.o.d.n. Mistersubsidie",
    "mach_gem_email": "Tim@mistersubsidie.nl",
    "mach_gem_persoon": "Tim Otte",
    "mach_gem_telefoon": "0611241360",
    "mach_gem_kvk": "24353031",
    "mach_check_bevoegd": formData.akkoordMachtiging,
    "mach_check_waarheid": formData.akkoordWaarheid,
    "mach_check_indienen": formData.machtigingIndienen,
    "mach_check_handelingen": formData.machtigingHandelingen,
    "mach_check_bezwaar": formData.machtigingBezwaar,
    "mach_best1_voorletters": formData.bestuurder1.voorletters,
    "mach_best1_achternaam": formData.bestuurder1.achternaam,
    "mach_best1_functie": formData.bestuurder1.functie,
    "mach_best1_datum": formData.datum,
    "mach_best2_voorletters": formData.bestuurder2.voorletters || "",
    "mach_best2_achternaam": formData.bestuurder2.achternaam || "",
    "mach_best2_functie": formData.bestuurder2.functie || "",
    "mach_best2_datum": formData.bestuurder2.nodig ? formData.datum : "",
    
    // De-minimis formulier velden
    "deminimis_radio_geen": formData.deMinimisType === 'geen',
    "deminimis_radio_wel": formData.deMinimisType === 'wel',
    "deminimis_radio_andere": formData.deMinimisType === 'andere',
    "deminimis_bedrag": formData.deMinimisAmount || "",
    "deminimis_andere_bedrag": formData.andereStaatssteunAmount || "",
    "deminimis_andere_datum": formData.andereStaatssteunDatum || "",
    "deminimis_bedrijfsnaam": formData.bedrijfsnaam,
    "deminimis_kvk": formData.kvkNummer,
    "deminimis_nace": formData.naceClassificatie,
    "deminimis_naam_func": formData.bestuurder1.volledigeNaam,
    "deminimis_functie": formData.bestuurder1.functie,
    "deminimis_adres": formData.adres,
    "deminimis_postcode": formData.postcode,
    "deminimis_plaats": formData.plaats,
    "deminimis_datum": formData.datum,
    
    // MKB formulier velden
    "mkb_naam_onderneming": formData.bedrijfsnaam,
    "mkb_aantal_fte": formData.aantalFte,
    "mkb_boekjaar": formData.laatsteBoekjaar,
    "mkb_jaaromzet": formData.jaaromzet,
    "mkb_balanstotaal": formData.balanstotaal,
    "mkb_check_klein": formData.ondernemingType === 'klein',
    "mkb_check_middelgroot": formData.ondernemingType === 'middelgroot',
    "mkb_check_groot": formData.ondernemingType === 'groot',
    "mkb_ondertekening_naam": formData.bestuurder1.volledigeNaam,
    "mkb_ondertekening_functie": formData.bestuurder1.functie,
    "mkb_ondertekening_datum_plaats": `${formData.datum}, ${formData.plaats || 'Nederland'}`
  };
  
  return {
    structured: structuredData,
    pdfFields: pdfFieldMapping
  };
};