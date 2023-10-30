import HelpDesk from './HelpDesk';

const url = 'http://localhost:3000/';
const widget = new HelpDesk(document, url);

widget.pageLoading();