import { IMemberInvite, MemberRoleEnum, MemberStatusEnum } from '@nest-starter/shared';
import { MemberEntity, OrganizationEntity } from './organization.entity';
import { BaseRepository } from '../base-repository';
import { Organization } from './organization.schema';

interface IAddMemberData {
  _userId?: string;
  roles: MemberRoleEnum[];
  invite?: IMemberInvite;
  memberStatus: MemberStatusEnum;
}

export class OrganizationRepository extends BaseRepository<OrganizationEntity> {
  constructor() {
    super(Organization, OrganizationEntity);
  }

  async removeMemberById(organizationId: string, memberId: string) {
    return await Organization.update(
      {
        _id: organizationId,
      },
      {
        $pull: {
          members: {
            _id: memberId,
          },
        },
      }
    );
  }

  async getOrganizationMembers(organizationId: string) {
     return [];
  }

  async findUserActiveOrganizations(userId: string): Promise<OrganizationEntity[]> {
    return await this.find({
      members: {
        $elemMatch: {
          _userId: userId,
          memberStatus: MemberStatusEnum.ACTIVE,
        },
      },
    });
  }

  async convertInvitedUserToMember(
    token: string,
    data: {
      memberStatus: MemberStatusEnum;
      _userId: string;
      answerDate: Date;
    }
  ) {
    await this.update(
      {
        'members.invite.token': token,
      },
      {
        'members.$.memberStatus': data.memberStatus,
        'members.$._userId': data._userId,
        'members.$.invite.answerDate': data.answerDate,
      }
    );
  }

  async findOrganizationByInviteToken(token: string) {
    return await this.findOne({
      'members.invite.token': token,
    });
  }

  async findOrganizationsByMailBox(mailBoxId: string) {
    return await this.find({
      'members.mailBoxes': mailBoxId,
    });
  }

  async findInviteeByEmail(organizationId: string, email: string): Promise<MemberEntity> {
    return null;
  }

  async addMember(organizationId: string, member: IAddMemberData): Promise<void> {
    await Organization.update(
      {
        _id: organizationId,
      },
      {
        $push: {
          members: {
            _userId: member._userId,
            roles: member.roles,
            invite: member.invite,
            memberStatus: member.memberStatus,
          },
        },
      }
    );
  }

  async isMemberOfOrganization(organizationId: string, userId: string): Promise<boolean> {
    return !false;
  }

  async findMemberByUserId(organizationId: string, userId: string): Promise<MemberEntity> {
    return null;
  }
}
