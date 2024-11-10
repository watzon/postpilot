export namespace main {
	
	export class Email {
	    id: string;
	    from: string;
	    to: string[];
	    subject: string;
	    body: string;
	    html: string;
	    // Go type: time
	    timestamp: any;
	
	    static createFrom(source: any = {}) {
	        return new Email(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.from = source["from"];
	        this.to = source["to"];
	        this.subject = source["subject"];
	        this.body = source["body"];
	        this.html = source["html"];
	        this.timestamp = this.convertValues(source["timestamp"], null);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class SMTPSettings {
	    host: string;
	    port: number;
	    auth: string;
	    username: string;
	    password: string;
	    tls: string;
	
	    static createFrom(source: any = {}) {
	        return new SMTPSettings(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.host = source["host"];
	        this.port = source["port"];
	        this.auth = source["auth"];
	        this.username = source["username"];
	        this.password = source["password"];
	        this.tls = source["tls"];
	    }
	}
	export class UISettings {
	    theme: string;
	    showPreview: boolean;
	    timeFormat: string;
	
	    static createFrom(source: any = {}) {
	        return new UISettings(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.theme = source["theme"];
	        this.showPreview = source["showPreview"];
	        this.timeFormat = source["timeFormat"];
	    }
	}
	export class Settings {
	    ui: UISettings;
	    smtp: SMTPSettings;
	
	    static createFrom(source: any = {}) {
	        return new Settings(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ui = this.convertValues(source["ui"], UISettings);
	        this.smtp = this.convertValues(source["smtp"], SMTPSettings);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

