import { DocuSignWrapper } from "./docusign";
import { Result } from "./error";

export enum NonEmployeeOrContractType {
	Physician = "contractPhysician",
	Volunteer = "volunteer",
	Student = "student",
	Other = "other"
};

export enum EmployeeOrg {
	VCH = "vch?",
	PHSA = "phsa?",
	PHC = "phc?",
	FHA = "fha?"
};

export enum VaccineSite {
	LeftDeltoid = "leftDeltoid",
	RightDeltoid = "rightDeltoid"
};

export class VaccinationFormData {

	static fromFormData = async (docusign: DocuSignWrapper, envelopeId: string)
		: Promise<Result<VaccinationFormData>> => {
		const docuSignFormResult = await docusign.getFormData(envelopeId);
		if (docuSignFormResult.isError()) return docuSignFormResult as Result<any>;
		const docuSignFormData = docuSignFormResult.result;
		if (docuSignFormData === undefined)
			return Result.Err("DocuSign form data was undefined", 500);

		console.log(docuSignFormData);
		const vfd = new VaccinationFormData();
		docuSignFormData.formData?.forEach(item => {
			for (let org in EmployeeOrg)
				if (item.name?.startsWith(org) && item.value == "X")
					return vfd.employeeOrg.push(org as EmployeeOrg);
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
				case "dateSigned":
					return vfd.dateSigned = item.value;
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
				case "necsOther":
					return vfd.necsOther = item.value;
				case "necsOrg":
					return vfd.necsOrg = item.value;
				default:
					break;
			}
		});
		return Result.Ok(vfd);
	};

	// Recipient properties
	firstName: string | undefined;
	lastName: string | undefined;
	email: string | undefined;
	birthDate: string | undefined;
	PHN: string | undefined;
	dateSigned: string | undefined;
	residentialAddress: string | undefined;
	phoneNumber: string | undefined;

	necsType: NonEmployeeOrContractType | undefined; // !TODO
	necsOther: string | undefined;
	necsOrg: string | undefined;

	firstFluVaccine: boolean | undefined; // !TODO
	seriousIllness: boolean | undefined; // !TODO
	prevVaccineReaction: boolean | undefined; // !TODO
	employeeOrg: EmployeeOrg[] = []; // !TODO

	// Nurse properties
	clinicLocation: string | undefined;
	lotNumber: string | undefined;
	nurseFirstName: string | undefined;
	nurseLastName: string | undefined;
	vaccineSite: VaccineSite | undefined; // !TODO

}
