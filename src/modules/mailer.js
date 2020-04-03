import nodemailer from 'nodemailer';
import path from 'path';
import hbs from 'nodemailer-express-handlebars';
import mailConfig from '../config/mail';

const { host, port, auth } = mailConfig;
const { user, pass } = auth;
const transport = nodemailer.createTransport({
  host,
  port,
  auth: { user, pass },
});

const handlebarOptions = {
  viewEngine: {
    extName: '.html',
    partialsDir: path.resolve('./src/resources/mail/'),
    layoutsDir: path.resolve('./src/resources/mail/'),
    defaultLayout: '',
  },
  viewPath: path.resolve('./src/resources/mail/'),
  extName: '.html',
};
transport.use('compile', hbs(handlebarOptions));
export default transport;
