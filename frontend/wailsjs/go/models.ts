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
	export class SpamAssassinSettings {
	    enabled: boolean;
	    binary: string;
	    host: string;
	    port: number;
	    useLocal: boolean;
	
	    static createFrom(source: any = {}) {
	        return new SpamAssassinSettings(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.enabled = source["enabled"];
	        this.binary = source["binary"];
	        this.host = source["host"];
	        this.port = source["port"];
	        this.useLocal = source["useLocal"];
	    }
	}
	export class UISettings {
	    theme: string;
	    showPreview: boolean;
	    timeFormat: string;
	    notification: boolean;
	    persistence: boolean;
	
	    static createFrom(source: any = {}) {
	        return new UISettings(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.theme = source["theme"];
	        this.showPreview = source["showPreview"];
	        this.timeFormat = source["timeFormat"];
	        this.notification = source["notification"];
	        this.persistence = source["persistence"];
	    }
	}
	export class Settings {
	    ui: UISettings;
	    smtp: SMTPSettings;
	    spamAssassin: SpamAssassinSettings;
	
	    static createFrom(source: any = {}) {
	        return new Settings(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ui = this.convertValues(source["ui"], UISettings);
	        this.smtp = this.convertValues(source["smtp"], SMTPSettings);
	        this.spamAssassin = this.convertValues(source["spamAssassin"], SpamAssassinSettings);
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

export namespace spam {
	
	export class SpamAssassinRule {
	    name: string;
	    description: string;
	    score: number;
	
	    static createFrom(source: any = {}) {
	        return new SpamAssassinRule(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.description = source["description"];
	        this.score = source["score"];
	    }
	}
	export class SpamReport {
	    isSpam: boolean;
	    score: number;
	    threshold: number;
	    rules: SpamAssassinRule[];
	    rawReport: string;
	
	    static createFrom(source: any = {}) {
	        return new SpamReport(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.isSpam = source["isSpam"];
	        this.score = source["score"];
	        this.threshold = source["threshold"];
	        this.rules = this.convertValues(source["rules"], SpamAssassinRule);
	        this.rawReport = source["rawReport"];
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

