import { Anima } from "@animaapp/anima-sdk";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc4MjAyNjAzNywianRpIjoiODliYzMwM2EtNWJjYi00ZjAxLTgyZTctZjU2MzIxMzg2MDVkIiwidHlwZSI6ImFjY2VzcyIsImlkZW50aXR5IjoiNmEzNzhmMjMzOWNkY2I2NTA3OTk4ZTI1IiwibmJmIjoxNzgyMDI2MDM3LCJjc3JmIjoiZTNkNzJlYTQtMjRjYy00MGRjLWFkM2UtMTMxZjJjZThhOWViIiwiZXhwIjoxODEzNTYyMDM3LCJkZWZhdWx0VGVhbUlkIjoiNmEzNzhmMjQzOWNkY2I2NTA3OTk4ZTI4In0.Btd29hSReAEHYdUe3d3_gcXO6AKggr3QZRzaFlYORjk";
const anima = new Anima({ auth: { token } });
anima.generateCodeFromPrompt({
  prompt: "A beautiful button",
  settings: {
    framework: 'html',
    styling: 'tailwind'
  }
}).then(res => {
  console.log("SUCCESS");
}).catch(err => {
  console.error("ERROR:");
  console.error(err);
});
