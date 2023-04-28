import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

const users = [...Array(24)].map((_, index) => ({
  id: faker.datatype.uuid(),
  avatarUrl: `/assets/images/avatars/avatar_${index + 1}.jpg`,
  name: faker.name.fullName(),
  company: faker.company.name(),
  isVerified: faker.datatype.boolean(),
  status: sample(['active', 'banned']),
  role: sample([
    'Leader',
    'Hr Manager',
    'UI Designer',
    'UX Designer',
    'UI/UX Designer',
    'Project Manager',
    'Backend Developer',
    'Full Stack Designer',
    'Front End Developer',
    'Full Stack Developer',
  ]),
}));

export const roles = [
  {
    id: faker.datatype.uuid(),
    name: 'Full Stack Developer',
    remark: "Has access to Jira and other development tools",
    permission: [1,2,3,4,5,6]
  },
  {
    id: faker.datatype.uuid(),
    name: 'Frontend Developer',
    remark: "Has access to Figma, Jira and other development tools",
    permission: [1,2,6]
  },
  {
    id: faker.datatype.uuid(),
    name: 'Backend Developer',
    remark: "Doesn't have access to sensitive information",
    permission: [1,3,5,6]
  },
  {
    id: faker.datatype.uuid(),
    name: 'Product Manager',
    remark: "Has access to sensitive information",
    permission: [1,2,3]
  },
  {
    id: faker.datatype.uuid(),
    name: 'UI/UX Designer',
    remark: "Has access to Figma and other design tools",
    permission: [4,5,6]
  },
];

export default users;
