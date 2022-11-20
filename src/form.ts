import { DocuSignWrapper } from "./docusign";

export class VaccinationFormData {

	static fromFormData = async (docusign: DocuSignWrapper, envelopeId: string) => {
		const docuSignFormData = await docusign.getFormData(envelopeId);
		console.log(docuSignFormData);
		const vfd = new VaccinationFormData();
		docuSignFormData.formData?.forEach(item => {
			switch (item.name?.trim()) {
				case "firstName":
					return vfd.firstName = item.value;
				case "lastName":
					return vfd.lastName = item.value;
				case "email":
					return vfd.email = item.value;
				case "birthDate":
					return vfd.birthDate = item.value;
				case "PHN":
					return vfd.PHN = item.value;
				case "clinicLocation":
					return vfd.clinicLocation = item.value;
				case "currentDate":
					return vfd.currentDate = item.value;
				case "residentialAddress":
					return vfd.residentialAddress = item.value;
				case "phoneNumber":
					return vfd.phoneNumber = item.value;
				case "lotNumber":
					return vfd.lotNumber = item.value;
				case "nurseFirstName":
					return vfd.nurseFirstName = item.value;
				case "nurseLastName":
					return vfd.nurseLastName = item.value;
				default:
					break;
			}
		});
	};

	// Recipient properties
	firstName: string | undefined;
	lastName: string | undefined;
	email: string | undefined;
	birthDate: string | undefined;
	PHN: string | undefined;
	currentDate: string | undefined;
	residentialAddress: string | undefined;
	phoneNumber: string | undefined;
	// Questionaire fields

	// Nurse properties
	clinicLocation: string | undefined;
	lotNumber: string | undefined;
	nurseFirstName: string | undefined;
	nurseLastName: string | undefined;
	// Vaccine
	// Site

}
