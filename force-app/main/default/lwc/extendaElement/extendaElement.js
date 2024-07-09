import { api, LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ExtendaElement extends LightningElement {

	errorMessage = '';

	/* 
	For certain LWC extending issues with legacy Lightning Locker (not needed with LWS)
	https://github.com/salesforce/lwc/issues/3235 
	*/
	@api 
	dispatchEventFromExtended(event) {
		this.dispatchEvent(event);
	}

	/**
	 * Debug an Object
	 * @param object - object to log
	 * @return undefined
	 */
	debug(obj) {
		console.info(JSON.parse(JSON.stringify({
			...obj,
		})));
	}

	/**
	 * Handle errors
	 * @param error - error object
	 * @param toast - whether to toast the error (optional, default true)
	 * @param dismissible - whether the toast is dismissible (optional, default true)
	 * @return undefined
	 */
	handleError(error, toast = true, dismissible = true) {

		const rawMessage = this.parseError(error);
		
		const message = Array.isArray(rawMessage) 
			? rawMessage.map(x => x.message).join('')
			: [rawMessage];

		console.warn(error)
		this.errorMessage = message.join('\n');
		this.toast({
			variant: 'error', 
			message: this.errorMessage, 
			title: 'Error',
			dismissible: dismissible ? 'dismissible' : 'sticky',
		});

		return this.errorMessage;
	}

	/* 
	* @description Toast messages to the user
	* @param config - toast config object
	* @property variant - type of toast (error, success, etc.)
	* @property message - message to display
	* @property title - title of the toast (optional)
	* @property mode - mode of the toast (dismissible, sticky, etc.)
	* @return true
	*/
	toast(config = {}) {
		
		const {
			variant, 
			message, 
			title, 
			mode = 'dismissible',
		} = config;

		const m = mode ? mode : 'dismissible';

		const t = title ? title : variant === 'error' ? 'Error' : 'Success';

		this.dispatchEvent(new ShowToastEvent({
			message,
			variant,
			title: t,
			mode: m,
		}));

		return true;
	}
	
	parseError(error) {
		if(error?.body?.message) {
			return error.body.message;
		}
		else if(error?.body?.pageErrors?.length) {
			return error.body.pageErrors[0].message;
		}
		else if(error?.body?.fieldErrors?.length) {
			return error.body.fieldErrors[0].message;
		}
		else if(error?.body?.duplicateResults?.length) {
			return error.body.duplicateResults[0].message;
		}
		else if(error?.message) {
			return error.message;
		}
		return error;
	}
}
