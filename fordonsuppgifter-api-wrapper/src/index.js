const cheerio = require('cheerio');
const playwright = require('playwright');
const userAgent = require('user-agents');

const LoadHTMLFromPage = async (regnr) => {
    try {
            let html = "";
        
            await playwright.chromium.launch({headless: true}).then(async (browser) => {
                const context = await browser.newContext({
                    userAgent: userAgent.toString()
                });
                
                const page = await context.newPage()
        
                await page.goto('https://fu-regnr.transportstyrelsen.se/extweb/UppgifterAnnatFordon')
            
                await page.waitForTimeout(500);
            
                await page.fill('#ts-regnr-sok', regnr);
            
                await page.locator('#btnSok').click();
        
                await page.waitForURL('https://fu-regnr.transportstyrelsen.se/extweb/UppgifterAnnatFordon/Fordonsuppgifter');
                
                await page.locator('#expand_button').click();
        
                html = await page.content();
            
                await browser.close();
                
            });
        
            return html;
        
    } catch (error) {
        
        throw "Error loading webpage";

    }
}

const ParseData = (html) => {
    try {
        if(typeof(html) === 'string' ){
            const $ = cheerio.load(html);
        
            $('strong').remove();
            $('br').remove();
        
            return $.text().replace(/\s+|([.,])(?=\S)/g, '$1 ').replace(/^\s|\s$/g, '');
        }else{
            return "undefined"
        }

    } catch (error) {

        throw("Error parsing html");
    }
}

const CrawlHTMLV2 = (html) => {
    try {

        const $ = cheerio.load(html);
    
        let model = {
               Sammanfattning:{
                CarMake: ParseData($('#ts-sammanfattningCollapse > div > div > div:nth-child(2) > p').html()),
                CarMakeExtra: ParseData($('#ts-sammanfattningCollapse > div > div > div:nth-child(3) > p').html()),
                Status: ParseData($('#ts-sammanfattningCollapse > div > div > div:nth-child(4) > p').html()),
                Color: ParseData($('#ts-sammanfattningCollapse > div > div > div:nth-child(5) > p').html()),
                ModelYear: ParseData($('#ts-sammanfattningCollapse > div > div > div:nth-child(6) > p').html()),
                ProdYear: ParseData($('#ts-sammanfattningCollapse > div > div > div:nth-child(7) > p').html()),
                Type: ParseData($('#ts-sammanfattningCollapse > div > div > div:nth-child(8) > p').html()),
                LastCheckup: ParseData($('#ts-sammanfattningCollapse > div > div > div:nth-child(9) > p').html()),
                Banned: ParseData($('#ts-sammanfattningCollapse > div > div > div:nth-child(10) > p').html())
            },
            Owner:{
                Acquired: ParseData($('#ts-agareCollapse > div > div.row.ts-row-align > div:nth-child(1) > p').html()),
                AmountOfOwners: ParseData($('#ts-agareCollapse > div > div.row.ts-row-align > div:nth-child(2) > p').html()),
                Name: ParseData($('#ts-agareCollapse > div > div.row.ts-row-align > div:nth-child(3) > p').html()),
                Address: ParseData($('#ts-agareCollapse > div > div.row.ts-row-align > div:nth-child(4) > p').html()),
                Zip: ParseData($('#ts-agareCollapse > div > div.row.ts-row-align > div:nth-child(5) > p').html()),
                City: ParseData($('#ts-agareCollapse > div > div.row.ts-row-align > div:nth-child(6) > p').html()),
                Insurance:{
                    Company: ParseData($('#ts-forsakring-innerCollapse > div > div > div:nth-child(1) > p').html()),
                    Date: ParseData($('#ts-forsakring-innerCollapse > div > div > div:nth-child(2) > p').html())
                }
            },
            Fordonsidentitet:{
                Registreringsnummer: ParseData($('#ts-fordonsidentitetCollapse > div > div > div:nth-child(1) > p').html()),
                Fabrikat: ParseData($('#ts-fordonsidentitetCollapse > div > div > div:nth-child(2) > p').html()),
                Handelsbeteckning: ParseData($('#ts-fordonsidentitetCollapse > div > div > div:nth-child(3) > p').html()),
                Farg: ParseData($('#ts-fordonsidentitetCollapse > div > div > div:nth-child(4) > p').html()),
                Fordonsslag: ParseData($('#ts-fordonsidentitetCollapse > div > div > div:nth-child(5) > p').html()),
                Fordonsslagsklass: ParseData($('#ts-fordonsidentitetCollapse > div > div > div:nth-child(6) > p').html()),
                Fordonskategori: ParseData($('#ts-fordonsidentitetCollapse > div > div > div:nth-child(7) > p').html()),
                Fordonsar: ParseData($('#ts-fordonsidentitetCollapse > div > div > div:nth-child(8) > p').html()),
                FordonetTillverkat: ParseData($('#ts-fordonsidentitetCollapse > div > div > div:nth-child(9) > p').html()),
                Identifieringsnummer: ParseData($('#ts-fordonsidentitetCollapse > div > div > div:nth-child(10) > p').html()),
                Typgodkannandenummer: ParseData($('#ts-fordonsidentitetCollapse > div > div > div:nth-child(11) > p').html()),
                Typ: ParseData($('#ts-fordonsidentitetCollapse > div > div > div:nth-child(12) > p').html()),
                Variant: ParseData($('#ts-fordonsidentitetCollapse > div > div > div:nth-child(13) > p').html()),
                Version: ParseData($('#ts-fordonsidentitetCollapse > div > div > div:nth-child(14) > p').html()),
                SkyltformatFram: ParseData($('#ts-fordonsidentitetCollapse > div > div > div:nth-child(15) > p').html()),
                SkyltformatBak: ParseData($('#ts-fordonsidentitetCollapse > div > div > div:nth-child(16) > p').html()),
                SenasteUtfardadeRegistreringsbevisDel1: ParseData($('#ts-fordonsidentitetCollapse > div > div > div:nth-child(17) > p').html()),
                SenasteUtfardadeRegistreringsbevisDel2: ParseData($('#ts-fordonsidentitetCollapse > div > div > div:nth-child(18) > p').html())
            },
            Status: {
                Fordonsstatus: ParseData($('#ts-statusCollapse > div > div > div:nth-child(1) > p').html()),
                PastalltForstaGangenISverige: ParseData($('#ts-statusCollapse > div > div > div:nth-child(2) > p').html()),
                Importinforsel: ParseData($('#ts-statusCollapse > div > div > div:nth-child(3) > p').html()),
            },
            Besiktning: {
                BesiktigasSenast: ParseData($('#ts-besiktningCollapse > div > div > div:nth-child(1) > p').html()),
                SenastGodkandaBesiktning: ParseData($('#ts-besiktningCollapse > div > div > div:nth-child(2) > p').html()),
                Matarstallning: ParseData($('#ts-besiktningCollapse > div > div > div:nth-child(3) > p').html()),
                DrivingBan: ParseData($('#ts-besiktningCollapse > div > div > div:nth-child(4) > p').html()),
                BanReason: ParseData($('#ts-besiktningCollapse > div > div > div:nth-child(5) > p').html()),
            },
            SkattOchAvgifter:{
                Fordonsskattepliktigt: ParseData($('#ts-skattCollapse > div > div > div:nth-child(1) > p').html()),
                Arsskatt: ParseData($('#ts-skattCollapse > div > div > div:nth-child(2) > p').html()),
                Vagtrafikregisteravgift: ParseData($('#ts-skattCollapse > div > div > div:nth-child(3) > p').html()),
                Betalningsmanader: ParseData($('#ts-skattCollapse > div > div > div:nth-child(4) > p').html()),
                Anvandningsforbud: ParseData($('#ts-skattCollapse > div > div > div:nth-child(5) > p').html()),
                AterbetalningVidAvstallning: ParseData($('#ts-skattCollapse > div > div > div:nth-child(6) > p').html()),
                Trangselskattepliktigt: ParseData($('#ts-skattCollapse > div > div > div:nth-child(7) > p').html()),
                CongestionTaxDuty: ParseData($('#ts-skattCollapse > div > div > div:nth-child(8) > p').html())
            },
            TekniskaData: {
                Kaross: ParseData($('#ts-karossCollapse > div > div > div > p').html()),
                mattOchVikt:{
                    Längd: ParseData($('#ts-MattViktCollapse > div > div > div:nth-child(1) > p').html()),
                    Bredd: ParseData($('#ts-MattViktCollapse > div > div > div:nth-child(2) > p').html()),
                    Höjd: ParseData($('#ts-MattViktCollapse > div > div > div:nth-child(3) > p').html()),
                    Tjänstevikt: ParseData($('#ts-MattViktCollapse > div > div > div:nth-child(4) > p').html()),
                    Maxlastvikt : ParseData($('#ts-MattViktCollapse > div > div > div:nth-child(5) > p').html()),
                    Totalvikt: ParseData($('#ts-MattViktCollapse > div > div > div:nth-child(6) > p').html()),
                    UrsprungligTotalvikt : ParseData($('#ts-MattViktCollapse > div > div > div:nth-child(7) > p').html()),
                    Skattevikt: ParseData($('#ts-MattViktCollapse > div > div > div:nth-child(8) > p').html()),
                    TaxWeightLock: ParseData($('#ts-MattViktCollapse > div > div > div:nth-child(9) > p').html()),
                    AllowedLoadWeight: ParseData($('#ts-MattViktCollapse > div > div > div:nth-child(10) > p').html()),
                    BackOverhang: ParseData($('#ts-MattViktCollapse > div > div > div:nth-child(11) > p').html()),
                    TrunkLength: ParseData($('#ts-MattViktCollapse > div > div > div:nth-child(12) > p').html())
                },
                axlarOchHjul:{
                    AxleAmount: ParseData($('#ts-HjulOchAxlarCollapse > div > div:nth-child(1) > div:nth-child(1) > p').html()),
                    WheelAmount: ParseData($('#ts-HjulOchAxlarCollapse > div > div:nth-child(1) > div:nth-child(2) > p').html()),
                    RoadFriendlySuspension: ParseData($('#ts-HjulOchAxlarCollapse > div > div:nth-child(1) > div:nth-child(3) > p').html()),
                    AxleOne:{
                        MaxAxelavståndAxel: ParseData($('#ts-HjulOchAxlarCollapse > div > div:nth-child(4) > div:nth-child(1) > p').html()),
                        Spårvidd: ParseData($('#ts-HjulOchAxlarCollapse > div > div:nth-child(4) > div:nth-child(2) > p').html()),
                        Däckdimension: ParseData($('#ts-HjulOchAxlarCollapse > div > div:nth-child(4) > div:nth-child(3) > p').html()),
                        Fälgdimension: ParseData($('#ts-HjulOchAxlarCollapse > div > div:nth-child(4) > div:nth-child(4) > p').html()),
                        TotalWeightDistribution: ParseData($('#ts-HjulOchAxlarCollapse > div > div:nth-child(4) > div:nth-child(5) > p').html()),
                    },
                    AxleTwo:{
                        Spårvidd: ParseData($('#ts-HjulOchAxlarCollapse > div > div:nth-child(7) > div:nth-child(1) > p').html()),
                        Däckdimension: ParseData($('#ts-HjulOchAxlarCollapse > div > div:nth-child(7) > div:nth-child(2) > p').html()),
                        Fälgdimension: ParseData($('#ts-HjulOchAxlarCollapse > div > div:nth-child(7) > div:nth-child(3) > p').html()),
                        TotalWeightDistribution: ParseData($('#ts-HjulOchAxlarCollapse > div > div:nth-child(7) > div:nth-child(4) > p').html()),
                    }
                },
                kopplingsanordningOchBromsar:{
                    SläpetsMaximalaTotalviktVidKörkortsbehörighetB: ParseData($('#ts-koppling-innerCollapse > div > div.row > div:nth-child(1) > p').html()),
                    SläpetsMaximalaTotalviktVidUtökadKörkortsbehörighetB : ParseData($('#ts-koppling-innerCollapse > div > div.row > div:nth-child(2) > p').html()),
                },
                passagerare: ParseData($('#ts-PassagerareSakerhetCollapse > div > div > div > p').html()),
                motorOchMilj: {
                    Växellåda: ParseData($('#ts-miljoCollapse > div > div > div:nth-child(1) > p').html()),
                    Slagvolym: ParseData($('#ts-miljoCollapse > div > div > div:nth-child(2) > p').html()),
                    Euroklassning: ParseData($('#ts-miljoCollapse > div > div > div:nth-child(3) > p').html()),
                    Utsläppsklass: ParseData($('#ts-miljoCollapse > div > div > div:nth-child(4) > p').html()),
                    Drivmedel: ParseData($('#ts-miljoCollapse > div > div > div:nth-child(5) > p').html()),
                    Motoreffekt: ParseData($('#ts-miljoCollapse > div > div > div:nth-child(6) > p').html()),
                    Effektnorm : ParseData($('#ts-miljoCollapse > div > div > div:nth-child(7) > p').html()),
                    MaxHastighet: ParseData($('#ts-miljoCollapse > div > div > div:nth-child(8) > p').html()),
                }
            }
        }

        return model;

    } catch (error) {

        throw "Error crawling html";
    }
   
}

function toPascalCase(str){
    return `${str}`
    .replace(new RegExp(/[-_]+/, 'g'), ' ')
    .replace(new RegExp(/[^\w\s]/, 'g'), '')
    .replace(
      new RegExp(/\s+(.)(\w*)/, 'g'),
      ($1, $2, $3) => `${$2.toUpperCase() + $3.toLowerCase()}`
    )
    .replace(new RegExp(/\w/), s => s.toUpperCase());
}

function replaceSpecialCharacters(str){

    let finalStr = "";

    for (let i = 0; i < str.length; i++) {
        let char = str[i];
        
        switch (char) {
            case 'Ö':
                char = 'O'
                break;
            case 'Ä':
                char = 'A'
                break;
            case 'ö':
                char = 'o'
                break;
            case 'ä':
                char = 'a'
                break;
            case 'å':
                char = 'a'
                break;
            case 'Å':
                char = 'A'
                break;
            default:
                break;
        }

        finalStr += char;
    }

    return finalStr;
}

const CrawlHTML = (html) => {
    try {
        const $ = cheerio.load(html);
    
        const model = {
            Summary:{
                CarMake: ParseData($('#ts-sammanfattningCollapse > div > div > div:nth-child(2) > p').html()),
                CarMakeExtra: ParseData($('#ts-sammanfattningCollapse > div > div > div:nth-child(3) > p').html()),
                Status: ParseData($('#ts-sammanfattningCollapse > div > div > div:nth-child(4) > p').html()),
                Color: ParseData($('#ts-sammanfattningCollapse > div > div > div:nth-child(5) > p').html()),
                ModelYear: ParseData($('#ts-sammanfattningCollapse > div > div > div:nth-child(6) > p').html()),
                ProdYear: ParseData($('#ts-sammanfattningCollapse > div > div > div:nth-child(7) > p').html()),
                Type: ParseData($('#ts-sammanfattningCollapse > div > div > div:nth-child(8) > p').html()),
                LastCheckup: ParseData($('#ts-sammanfattningCollapse > div > div > div:nth-child(9) > p').html()),
                Banned: ParseData($('#ts-sammanfattningCollapse > div > div > div:nth-child(10) > p').html())
            },
            Owner:{
                Acquired: ParseData($('#ts-agareCollapse > div > div.row.ts-row-align > div:nth-child(1) > p').html()),
                AmountOfOwners: ParseData($('#ts-agareCollapse > div > div.row.ts-row-align > div:nth-child(2) > p').html()),
                Name: ParseData($('#ts-agareCollapse > div > div.row.ts-row-align > div:nth-child(3) > p').html()),
                Address: ParseData($('#ts-agareCollapse > div > div.row.ts-row-align > div:nth-child(4) > p').html()),
                Zip: ParseData($('#ts-agareCollapse > div > div.row.ts-row-align > div:nth-child(5) > p').html()),
                City: ParseData($('#ts-agareCollapse > div > div.row.ts-row-align > div:nth-child(6) > p').html()),
                Insurance:{
                    Company: ParseData($('#ts-forsakring-innerCollapse > div > div > div:nth-child(1) > p').html()),
                    Date: ParseData($('#ts-forsakring-innerCollapse > div > div > div:nth-child(2) > p').html())
                }
            },
            Identity:{
                Regnr: ParseData($('#ts-fordonsidentitetCollapse > div > div > div:nth-child(1) > p').html()),
                CarMake: ParseData($('#ts-fordonsidentitetCollapse > div > div > div:nth-child(2) > p').html()),
                CarMakeExtra: ParseData($('#ts-fordonsidentitetCollapse > div > div > div:nth-child(3) > p').html()),
                Color: ParseData($('#ts-fordonsidentitetCollapse > div > div > div:nth-child(4) > p').html()),
                Type: ParseData($('#ts-fordonsidentitetCollapse > div > div > div:nth-child(5) > p').html()),
                Category: ParseData($('#ts-fordonsidentitetCollapse > div > div > div:nth-child(6) > p').html()),
                ModelYear: ParseData($('#ts-fordonsidentitetCollapse > div > div > div:nth-child(7) > p').html()),
                ProdYear: ParseData($('#ts-fordonsidentitetCollapse > div > div > div:nth-child(8) > p').html()),
                ChassiID: ParseData($('#ts-fordonsidentitetCollapse > div > div > div:nth-child(9) > p').html()),
                Approvalnr: ParseData($('#ts-fordonsidentitetCollapse > div > div > div:nth-child(10) > p').html()),
                ApprovalDate: ParseData($('#ts-fordonsidentitetCollapse > div > div > div:nth-child(11) > p').html()),
                VariantType: ParseData($('#ts-fordonsidentitetCollapse > div > div > div:nth-child(12) > p').html()),
                Variant: ParseData($('#ts-fordonsidentitetCollapse > div > div > div:nth-child(13) > p').html()),
                Version: ParseData($('#ts-fordonsidentitetCollapse > div > div > div:nth-child(14) > p').html()),
                PlateFormatFront: ParseData($('#ts-fordonsidentitetCollapse > div > div > div:nth-child(15) > p').html()),
                PlateFormatBack: ParseData($('#ts-fordonsidentitetCollapse > div > div > div:nth-child(16) > p').html()),
                RegistrationEvidenceP1: ParseData($('#ts-fordonsidentitetCollapse > div > div > div:nth-child(17) > p').html()),
                RegistrationEvidenceP2: ParseData($('#ts-fordonsidentitetCollapse > div > div > div:nth-child(18) > p').html())
            },
            Status: {
                VehicleStatus: ParseData($('#ts-statusCollapse > div > div > div:nth-child(1) > p').html()),
                RegistratedFirstTime: ParseData($('#ts-statusCollapse > div > div > div:nth-child(2) > p').html()),
                Imported: ParseData($('#ts-statusCollapse > div > div > div:nth-child(3) > p').html()),
            },
            Inspection: {
                InspectionDeadline: ParseData($('#ts-besiktningCollapse > div > div > div:nth-child(1) > p').html()),
                LastApprovedInspection: ParseData($('#ts-besiktningCollapse > div > div > div:nth-child(2) > p').html()),
                MeterReading: ParseData($('#ts-besiktningCollapse > div > div > div:nth-child(3) > p').html()),
                DrivingBan: ParseData($('#ts-besiktningCollapse > div > div > div:nth-child(4) > p').html()),
                BanReason: ParseData($('#ts-besiktningCollapse > div > div > div:nth-child(5) > p').html()),
            },
            TaxesAndFees:{
                TaxDuty: ParseData($('#ts-skattCollapse > div > div > div:nth-child(1) > p').html()),
                YearTax: ParseData($('#ts-skattCollapse > div > div > div:nth-child(2) > p').html()),
                RoadCharge: ParseData($('#ts-skattCollapse > div > div > div:nth-child(3) > p').html()),
                PayMonth: ParseData($('#ts-skattCollapse > div > div > div:nth-child(4) > p').html()),
                UseBan: ParseData($('#ts-skattCollapse > div > div > div:nth-child(5) > p').html()),
                DebitedFee: ParseData($('#ts-skattCollapse > div > div > div:nth-child(6) > p').html()),
                ClaimFee: ParseData($('#ts-skattCollapse > div > div > div:nth-child(7) > p').html()),
                CongestionTaxDuty: ParseData($('#ts-skattCollapse > div > div > div:nth-child(8) > p').html())
            },
            TechnicalData: {
                Body: ParseData($('#ts-karossCollapse > div > div > div > p').html()),
                MeasurmentsAndWeight:{
                    Length: ParseData($('#ts-MattViktCollapse > div > div > div:nth-child(1) > p').html()),
                    Width: ParseData($('#ts-MattViktCollapse > div > div > div:nth-child(2) > p').html()),
                    Height: ParseData($('#ts-MattViktCollapse > div > div > div:nth-child(3) > p').html()),
                    ServiceWeight: ParseData($('#ts-MattViktCollapse > div > div > div:nth-child(4) > p').html()),
                    MaxLoadWeight: ParseData($('#ts-MattViktCollapse > div > div > div:nth-child(5) > p').html()),
                    TotalWeight: ParseData($('#ts-MattViktCollapse > div > div > div:nth-child(6) > p').html()),
                    OriginalTotalWeight: ParseData($('#ts-MattViktCollapse > div > div > div:nth-child(7) > p').html()),
                    TaxWeight: ParseData($('#ts-MattViktCollapse > div > div > div:nth-child(8) > p').html()),
                    TaxWeightLock: ParseData($('#ts-MattViktCollapse > div > div > div:nth-child(9) > p').html()),
                    AllowedLoadWeight: ParseData($('#ts-MattViktCollapse > div > div > div:nth-child(10) > p').html()),
                    BackOverhang: ParseData($('#ts-MattViktCollapse > div > div > div:nth-child(11) > p').html()),
                    TrunkLength: ParseData($('#ts-MattViktCollapse > div > div > div:nth-child(12) > p').html())
                },
                AxlesAndWheels:{
                    AxleAmount: ParseData($('#ts-HjulOchAxlarCollapse > div > div:nth-child(1) > div:nth-child(1) > p').html()),
                    WheelAmount: ParseData($('#ts-HjulOchAxlarCollapse > div > div:nth-child(1) > div:nth-child(2) > p').html()),
                    RoadFriendlySuspension: ParseData($('#ts-HjulOchAxlarCollapse > div > div:nth-child(1) > div:nth-child(3) > p').html()),
                    AxleOne:{
                        MaxAxleDistanceOneAndTwo: ParseData($('#ts-HjulOchAxlarCollapse > div > div:nth-child(4) > div:nth-child(1) > p').html()),
                        TireDimension: ParseData($('#ts-HjulOchAxlarCollapse > div > div:nth-child(4) > div:nth-child(2) > p').html()),
                        RimDimension: ParseData($('#ts-HjulOchAxlarCollapse > div > div:nth-child(4) > div:nth-child(3) > p').html()),
                        GuaranteedAxlePressure: ParseData($('#ts-HjulOchAxlarCollapse > div > div:nth-child(4) > div:nth-child(4) > p').html()),
                        TotalWeightDistribution: ParseData($('#ts-HjulOchAxlarCollapse > div > div:nth-child(4) > div:nth-child(5) > p').html()),
                    },
                    AxleTwo:{
                        TireDimension: ParseData($('#ts-HjulOchAxlarCollapse > div > div:nth-child(7) > div:nth-child(1) > p').html()),
                        RimDimension: ParseData($('#ts-HjulOchAxlarCollapse > div > div:nth-child(7) > div:nth-child(2) > p').html()),
                        GuaranteedAxlePressure: ParseData($('#ts-HjulOchAxlarCollapse > div > div:nth-child(7) > div:nth-child(3) > p').html()),
                        TotalWeightDistribution: ParseData($('#ts-HjulOchAxlarCollapse > div > div:nth-child(7) > div:nth-child(4) > p').html()),
                    }
                },
                Brakes:{
                    Equipment: ParseData($('#ts-koppling-innerCollapse > div > div.row > div:nth-child(1) > p').html()),
                    MaxCombinedBruttoWeight: ParseData($('#ts-koppling-innerCollapse > div > div.row > div:nth-child(2) > p').html()),
                },
                MaxPassengers: ParseData($('#ts-PassagerareSakerhetCollapse > div > div > div > p').html()),
                Engine: {
                    Gearbox: ParseData($('#ts-miljoCollapse > div > div > div:nth-child(1) > p').html()),
                    PunchVolume: ParseData($('#ts-miljoCollapse > div > div > div:nth-child(2) > p').html()),
                    EnviromentClass: ParseData($('#ts-miljoCollapse > div > div > div:nth-child(3) > p').html()),
                    Fuel: ParseData($('#ts-miljoCollapse > div > div > div:nth-child(4) > p').html()),
                    TankVolume: ParseData($('#ts-miljoCollapse > div > div > div:nth-child(5) > p').html()),
                    EngineEffect: ParseData($('#ts-miljoCollapse > div > div > div:nth-child(6) > p').html()),
                    EffectNorm: ParseData($('#ts-miljoCollapse > div > div > div:nth-child(7) > p').html()),
                    TopSpeed: ParseData($('#ts-miljoCollapse > div > div > div:nth-child(8) > p').html()),
                }
            }
    
        }
        
        return model;
        
    } catch (error) {

        throw "Error crawling html";
    }

}

const ValidateRegNr = (regnr) => {
    return regnr.match(/[a-zA-ZåäöÅÄÖ\d\s]{2,7}/g).length == 1;
}

exports.TestValidateReg = (regnr) => {
    return ValidateRegNr(regnr)
}

// maps data dynamically to a dynamic model, model/data is not static
// property names are in swedish
exports.GetVehicleInformation = async (regnr) => {
    if(!regnr) return "no registration number attached";
    if(!ValidateRegNr(regnr)) return "not a valid registration number"

    const html = await LoadHTMLFromPage(regnr);
    return CrawlHTMLV2(html);
}

// uses the old version of the crawler
// maps data to a static model with english property names, will not always be correct, use at own risk
exports.GetVehicleInformationEnglish = async (regnr) => {
    if(!regnr) return "no registration number attached";
    if(!ValidateRegNr(regnr)) return "not a valid registration number"

    const html = await LoadHTMLFromPage(regnr);
    return CrawlHTML(html);
}

