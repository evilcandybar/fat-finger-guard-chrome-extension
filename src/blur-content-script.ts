export class BlurController {
   
    COLLECTION_BID_FLOOR_PRICE_IDENTIFIER: string = 'sc-iJKOTD jfsUuI';
    SELL_ITEM_FLOOR_PRICE_IDENTIFIER: string = 'sc-iJKOTD cDyuof';

    floorPriceElement: any = undefined
    floorPriceIdentifier: any = undefined;
    isPorfolioPage: boolean = false;
    priceBoxDiscoveryInterval: any = undefined;
    floorPrice: any = undefined;
    aboveThresholdPercentage: number = 50;
    belowThresholdPercentage: number = 50;
    currentUrl: string = '';
    
    constructor() {
        this.setup();
      
    }

    async setup() {
        chrome.storage.sync.get("blurBelowInput", (result) => {
            if (result.blurBelowInput) {
                this.belowThresholdPercentage = result.blurBelowInput;
            }
        });

        chrome.storage.sync.get("blurAboveInput", (result) => {
            if (result.blurAboveInput) {
                this.aboveThresholdPercentage = result.blurAboveInput;
            }
        });

        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.message === 'setBlurAboveInput') {
                this.aboveThresholdPercentage = request.value;
            }

            if (request.message === 'setBlurBelowInput') {
                this.belowThresholdPercentage = request.value;
            }
        });

        this.currentUrl = window.location.href;
        this.setIdentifiers();
        this.setupPriceBoxDiscovery();
    }

    setIdentifiers() {
        this.currentUrl = window.location.href;
        this.isPorfolioPage = false;

        if (this.currentUrl?.includes('/portfolio')) {
            this.isPorfolioPage = true;
            this.floorPriceIdentifier = this.SELL_ITEM_FLOOR_PRICE_IDENTIFIER;
        } else if (this.currentUrl?.includes('/bids')) {
            this.floorPriceIdentifier = this.COLLECTION_BID_FLOOR_PRICE_IDENTIFIER;
        } 
    }

    setupPriceBoxDiscovery() {
        this.priceBoxDiscoveryInterval = setInterval(
            () => {
                let elements: any = document.getElementsByClassName(this.floorPriceIdentifier);

                if (!!this.floorPriceElement && elements.length == 0) {
                    this.floorPriceElement = undefined;
                }

                if (elements.length > 0) {
                    this.attachElementEventListeners(elements[0]);
                } else {
                    this.setIdentifiers();
                }
        }, 500);
    }

    attachElementEventListeners(element: any) {
        if (this.currentUrl != window.location.href) {
            this.setIdentifiers();
            return;
        }

        this.floorPriceElement = element
        let priceString = this.floorPriceElement.innerText;
        try {
            this.floorPrice = +priceString;

            if (this.isPorfolioPage) {
                this.handlePortfolioPageWarnings();
            } else {
                this.handleBidPageWarnings();
            }
        } catch (e) {
            console.log(e);
        } 

    }

    handlePortfolioPageWarnings() {
        const basketContextReference = Array.from(document.querySelectorAll(`[role="columnheader"]`)).find((e: any) => e.innerText === 'PROCEEDS');
        const basketItemsContainer: any = !!basketContextReference ? basketContextReference.parentElement?.parentElement?.children[1]?.firstChild?.firstChild ?? [] : [];
            [...basketItemsContainer.children].forEach((row: any) => {
                let inputBox: any = [...row.children][row.children.length - 1];
                const inputElement: any = inputBox.lastChild.nodeName == '#text' ? inputBox.lastChild : Array.from(inputBox.lastChild?.children).find((e: any) => e.tagName == 'INPUT');

                const observer = new MutationObserver((mutationsList: any, observer) => {
                    if (inputBox.parentElement.lastChild.id == 'fat-finger-warning') {
                        inputBox.parentElement.removeChild(inputBox.parentElement.lastChild);
                        inputBox.lastChild.style = '';
                        const buttonContainer: any = Array.from(document.querySelectorAll(`[transform="uppercase"]`)).find((e: any) => e.innerText === 'DURATION')?.parentElement?.parentElement;
                        const confirmButton: any = document.getElementById('fat-finger-confirm-btn')
                        if (!!buttonContainer && !!confirmButton) {
                            buttonContainer.removeChild(confirmButton);
                        }
                    }

                    const inputValue: any =  Number(inputElement.value);
                    if (!Number.isNaN(inputValue) && +inputValue != 0 && this.isPriceOverThreshhold(inputValue)) {
                        inputBox.lastChild.style = 'border: 2px solid #ea4711';
                        const newElementString = `POTENTIAL FAT FINGER > ${this.getBreachedThresholdPercentage(inputValue)}% ${this.isPositiveThreshold(Number(inputBox.lastChild.firstChild.value)) ? 'above' : 'below'} floor`;
                        const newElement: any = document.createElement('div');
                        newElement.innerText = newElementString;
                        newElement.id = "fat-finger-warning";
                        newElement.style = "position: fixed;z-index: 999999;width: 100%;height: 13px;background: #ea4711;top: 35px;left: 1px;font-size: 12px;padding-right: 8px;letter-spacing: -1px;font-weight: 900;color: black;text-align: right;font-family: 'Proto Mono';";
                        inputBox.parentElement.appendChild(newElement);
                        
                        if (!document.getElementById('fat-finger-confirm-btn')) {
                            const buttonContainer: any = Array.from(document.querySelectorAll(`[transform="uppercase"]`)).find((e: any) => e.innerText === 'DURATION')?.parentElement?.parentElement;
                            const clonedButton = buttonContainer.lastChild.cloneNode(true);
                            clonedButton.style = "font-family: 'Proto Mono';position: fixed;width: 200px;opacity: 1;padding-top: 2px;cursor: pointer;text-transform: uppercase;";
                            clonedButton.firstChild.style = "line-height: 13px;";
                            clonedButton.id = "fat-finger-confirm-btn";
                            clonedButton.innerText = "confirm fat finger check"
                            clonedButton.disabled = false;
                            clonedButton.addEventListener('click', (event: any) => {
                                clonedButton.parentElement.removeChild(event.target);
                            });
                            buttonContainer.appendChild(clonedButton);
                        }
                    } 
                });

                observer.observe(inputElement, { attributes: true, attributeFilter: ['value'] });
            });
    }

    handleBidPageWarnings() {
        const bidContainer: any = Array.from(document.querySelectorAll(`[transform="uppercase"]`)).find((e: any) => e.innerText === 'BID PRICE');

        if (!!bidContainer) {

           const inputElement = bidContainer.parentElement.lastChild.firstChild.firstChild;

           inputElement.addEventListener('input', (event: any) => {
                if (inputElement.parentElement.lastChild.id == 'fat-finger-warning') {
                    inputElement.parentElement.removeChild(inputElement.parentElement.lastChild);
                    inputElement.style = '';
                    const buttonContainer: any = Array.from(document.querySelectorAll(`[transform="uppercase"]`)).find((e: any) => e.innerText === 'DURATION')?.parentElement?.parentElement;
                    const confirmButton: any = document.getElementById('fat-finger-confirm-btn')
                    if (!!buttonContainer && !!confirmButton) {
                        buttonContainer.removeChild(confirmButton);
                    }
                }

                const inputValue: any =  Number(inputElement.value);
                if (!Number.isNaN(inputValue) && +inputValue != 0 && this.isPriceOverThreshhold(inputValue)) {
                    inputElement.style = 'border: 2px solid #ea4711';
                    const newElementString = `POTENTIAL FAT FINGER > ${this.getBreachedThresholdPercentage(inputValue)}% ${this.isPositiveThreshold(Number(inputElement.value)) ? 'above' : 'below'} floor`;
                    const newElement: any = document.createElement('div');
                    newElement.innerText = newElementString;
                    newElement.id = "fat-finger-warning";
                    newElement.style = `position: absolute;z-index: 999999;width: 100%;height: 13px;background: rgb(234, 71, 17);bottom: 91px;left: 1px;font-size: 12px;padding-right: 8px;letter-spacing: -1px;font-weight: 900;color: black;text-align: right;font-family: "Proto Mono"`;
                    inputElement.parentElement.appendChild(newElement);

                    if (!document.getElementById('fat-finger-confirm-btn')) {
                        const buttonContainer: any = Array.from(document.querySelectorAll(`[transform="uppercase"]`)).find((e: any) => e.innerText.includes('PLACE BID'))?.parentElement?.parentElement;
                        const clonedButton = buttonContainer.lastChild.cloneNode(true);
                        clonedButton.style = `display: flex;min-width: 200px;align-items: center;justify-content: space-between;opacity: 1;position: fixed;z-index: 2; cursor: pointer; text-align: center;font-family: "Proto Mono"; font-size: 12px; text-transform: uppercase`;
                        clonedButton.removeChild(clonedButton.lastChild);
                        clonedButton.id = "fat-finger-confirm-btn";
                        clonedButton.innerText = "confirm fat finger check"
                        clonedButton.disabled = false;
                        clonedButton.addEventListener('click', (event: any) => {
                            clonedButton.parentElement.removeChild(event.target);
                        });
                        buttonContainer.appendChild(clonedButton);
                    }
                } 

            });
        }
    }

    isPriceOverThreshhold(price: number) {
        const priceIncrease = price - this.floorPrice;
        const priceIncreasePercentage = priceIncrease / this.floorPrice * 100;

        return priceIncreasePercentage >= this.aboveThresholdPercentage || priceIncreasePercentage <= -this.belowThresholdPercentage;
    }

    getBreachedThresholdPercentage(price: number) {
        const priceIncrease = price - this.floorPrice;
        return Math.abs(Math.round(priceIncrease / this.floorPrice * 100));
    }

    isPositiveThreshold(price: number) {
        const priceIncrease = price - this.floorPrice;
        return priceIncrease > 0;
    }

}

new BlurController();