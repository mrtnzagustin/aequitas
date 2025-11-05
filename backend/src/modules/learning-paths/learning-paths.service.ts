import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LearningPath, PathStatus } from './entities/learning-path.entity';
import { PathNode, NodeStatus } from './entities/path-node.entity';

@Injectable()
export class LearningPathsService {
  constructor(
    @InjectRepository(LearningPath)
    private readonly pathRepository: Repository<LearningPath>,
    @InjectRepository(PathNode)
    private readonly nodeRepository: Repository<PathNode>,
  ) {}

  async generatePath(studentId: string, subject: string): Promise<LearningPath> {
    const path = this.pathRepository.create({
      studentId,
      subject,
      startDate: new Date(),
      estimatedCompletionDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      currentNode: 'node-1',
      completionPercentage: 0,
      difficultyLevel: 5,
      status: PathStatus.ACTIVE,
    });

    const saved = await this.pathRepository.save(path);

    // Generate initial nodes
    await this.generateNodes(saved.id, subject);

    return saved;
  }

  async getPath(pathId: string): Promise<LearningPath> {
    const path = await this.pathRepository.findOne({ where: { id: pathId } });
    if (!path) {
      throw new NotFoundException('Path not found');
    }
    return path;
  }

  async getPathNodes(pathId: string): Promise<PathNode[]> {
    return this.nodeRepository.find({
      where: { pathId },
      order: { sequence: 'ASC' },
    });
  }

  async completeNode(nodeId: string, masteryScore: number): Promise<PathNode> {
    const node = await this.nodeRepository.findOne({ where: { id: nodeId } });
    if (!node) {
      throw new NotFoundException('Node not found');
    }

    node.status = NodeStatus.COMPLETED;
    node.masteryScore = masteryScore;
    node.completedAt = new Date();
    node.attemptsCount += 1;

    const saved = await this.nodeRepository.save(node);

    // Unlock next nodes
    await this.unlockNextNodes(node.pathId, nodeId);

    // Update path progress
    await this.updatePathProgress(node.pathId);

    // Adapt difficulty if needed
    if (masteryScore < 60) {
      await this.adaptDifficulty(node.pathId, 'DECREASE');
    } else if (masteryScore > 90) {
      await this.adaptDifficulty(node.pathId, 'INCREASE');
    }

    return saved;
  }

  async adaptDifficulty(pathId: string, direction: 'INCREASE' | 'DECREASE'): Promise<void> {
    const path = await this.pathRepository.findOne({ where: { id: pathId } });
    if (!path) return;

    if (direction === 'INCREASE') {
      path.difficultyLevel = Math.min(10, path.difficultyLevel + 1);
    } else {
      path.difficultyLevel = Math.max(1, path.difficultyLevel - 1);
    }

    path.adaptationCount += 1;
    await this.pathRepository.save(path);
  }

  private async generateNodes(pathId: string, subject: string): Promise<void> {
    const concepts = ['basics', 'intermediate', 'advanced'];
    for (let i = 0; i < concepts.length; i++) {
      const node = this.nodeRepository.create({
        pathId,
        sequence: i + 1,
        conceptId: `${subject}-${concepts[i]}`,
        difficulty: 5,
        estimatedDuration: 30,
        prerequisites: i > 0 ? [`node-${i}`] : [],
        status: i === 0 ? NodeStatus.UNLOCKED : NodeStatus.LOCKED,
      });
      await this.nodeRepository.save(node);
    }
  }

  private async unlockNextNodes(pathId: string, completedNodeId: string): Promise<void> {
    const nodes = await this.nodeRepository.find({ where: { pathId } });
    for (const node of nodes) {
      if (node.prerequisites.includes(completedNodeId) && node.status === NodeStatus.LOCKED) {
        node.status = NodeStatus.UNLOCKED;
        await this.nodeRepository.save(node);
      }
    }
  }

  private async updatePathProgress(pathId: string): Promise<void> {
    const nodes = await this.nodeRepository.find({ where: { pathId } });
    const completed = nodes.filter(n => n.status === NodeStatus.COMPLETED).length;
    const total = nodes.length;

    const path = await this.pathRepository.findOne({ where: { id: pathId } });
    if (path) {
      path.completionPercentage = (completed / total) * 100;
      if (path.completionPercentage === 100) {
        path.status = PathStatus.COMPLETED;
      }
      await this.pathRepository.save(path);
    }
  }
}
